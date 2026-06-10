// server/server.js
const http = require('http');
const net = require('net');
const socketIo = require('socket.io');
const app = require('./app');
const { Game, Player, Round, Category, Question } = require('./db/index');

const server = http.createServer(app);
const io = socketIo(server);

var gameState = undefined;

// Function to reload and broadcast the game state
const reloadGameState = async () => {
  gameState = await Game.findOne({
    include: [
      { model: Round, as: 'ActiveRound', include: [
        Player,
        { model: Category, include: [
          Question
        ] }
      ] },
      { model: Question, as: 'ActiveQuestion' },
      { model: Player, as: 'ActivePlayer' },
      {
        model: Round
      },
    ]
  });

  if (gameState && gameState.ActiveRound && gameState.ActiveRound.Categories) {
    gameState.ActiveRound.Categories.sort((a, b) => a.id - b.id);
    gameState.ActiveRound.Categories.forEach(category => {
      category.Questions.sort((a, b) => a.points - b.points);
    });
  }

  if (gameState && gameState.ActiveRound && gameState.ActiveRound.Players) {
    gameState.ActiveRound.Players.sort((a, b) => a.id - b.id);
  }

  if (gameState && gameState.Rounds) {
    gameState.Rounds.sort((a, b) => a.id - b.id);
  }

  /*var activeRound = null;

  if(gameState.activeRoundId) {
    activeRound = await Round.findByPk(gameState.activeRoundId, {
      include: [
        {
          model: Category,
          include: [ Question ],
        },
        {
          model: Player, // Include players for each round
        },
      ]
    })
    activeRound.Categories.forEach((category) => {
      category.Questions.sort((a, b) => a.points - b.points);
    });
    activeRound.Players.sort((a, b) => a.id - b.id);
    gameState.ActiveRound = activeRound;
  }*/
  
  updateBuzzerStates();
  
  io.emit('gameState', gameState);
};

function sortPlayersBySeat(players) {
  return players.sort((a, b) => a.id - b.id);
}

function normalizeBuzzerId(buzzerId) {
  if (buzzerId === undefined || buzzerId === null) {
    return null;
  }

  const normalized = String(buzzerId).trim();
  return normalized === '' ? null : normalized;
}

async function savePlayerBuzzer(player, buzzerId) {
  const normalizedBuzzerId = normalizeBuzzerId(buzzerId);

  if (normalizeBuzzerId(player.buzzer) === normalizedBuzzerId) {
    return;
  }

  player.buzzer = normalizedBuzzerId;
  await player.save();
}

async function getSeatIndexForPlayer(player) {
  const round = await Round.findByPk(player.RoundId, { include: [Player] });

  if (!round || !round.Players) {
    return -1;
  }

  const players = sortPlayersBySeat(round.Players);
  return players.findIndex((roundPlayer) => roundPlayer.id === player.id);
}

async function syncBuzzerToSeat(seatIndex, buzzerId) {
  if (!gameState || seatIndex < 0) {
    return;
  }

  const rounds = await Round.findAll({
    where: { GameId: gameState.id },
    include: [Player],
  });

  for (const round of rounds) {
    const players = sortPlayersBySeat(round.Players || []);
    const player = players[seatIndex];

    if (player) {
      await savePlayerBuzzer(player, buzzerId);
    }
  }
}

async function syncActiveRoundBuzzersToRound(roundId) {
  if (!gameState || !gameState.ActiveRound || !gameState.ActiveRound.Players) {
    return;
  }

  const targetRound = await Round.findByPk(roundId, { include: [Player] });

  if (!targetRound || !targetRound.Players) {
    return;
  }

  const sourcePlayers = sortPlayersBySeat(gameState.ActiveRound.Players);
  const targetPlayers = sortPlayersBySeat(targetRound.Players);

  for (let seatIndex = 0; seatIndex < targetPlayers.length; seatIndex++) {
    await savePlayerBuzzer(targetPlayers[seatIndex], sourcePlayers[seatIndex]?.buzzer);
  }
}

function releaseBuzzerSlot(buzzerId) {
  const normalizedBuzzerId = normalizeBuzzerId(buzzerId);

  if (!normalizedBuzzerId) {
    return;
  }

  const buzzer = buzzers.find((b) => b.uniqueId === normalizedBuzzerId);

  if (buzzer) {
    buzzer.uniqueId = undefined;
    buzzer.socket = undefined;
    buzzer.color = buzzerColors[Number(buzzer.name)] || buzzer.color;
  }
}

// Initialize game state on server start
if (gameState === undefined) {
  reloadGameState();
}

// WebSocket connection
io.on('connection', async (socket) => {
  if(gameState === undefined) {
    reloadGameState();
  } else {
    socket.emit('gameState', gameState);
  }

  console.log('New client connected');

  const updateGameState = async () => {
    try {
      await gameState.save();
      reloadGameState();
    } catch (error) {
      console.error('Error updating game state in DB:', error);
    }
  };

  socket.on('setActiveRound', async (roundId) => {
    console.log("received setActiveRound("+roundId+")");
    await syncActiveRoundBuzzersToRound(roundId);
    gameState.activeRoundId = roundId;
    gameState.activePlayerId = null;
    gameState.showSolution = false;
    await updateGameState();
  });


  // Listen for updated game state from the client
  socket.on('setActiveQuestion', async (questionId) => {
    console.log("received setActiveQuestion("+questionId+")");
    gameState.activeQuestionId = questionId;

    try {
      // Update the game in the database
      if(questionId != null) {
        var question = await Question.findByPk(questionId);
        question.played = true;
        question.save();
      } else {
        gameState.activePlayerId = null;
      }
    } catch (error) {
      console.error('Error updating game state in DB:', error);
    }
    gameState.showSolution = false;

    updateGameState();
  });

  socket.on('setActivePlayer', async (playerId) => {
    console.log("received setActivePlayer("+playerId+")");
    if(playerId != null) {
      if(gameState.ActivePlayer || gameState.showSolution || (!gameState.ActiveQuestion && !gameState.buzzerTest)) {
        return;
      }
      io.emit('pauseMedia');
    }
    gameState.activePlayerId = playerId;
    updateGameState();
  });

  socket.on('correctAnswer', async () => {
    console.log("received correctAnswer()");
    gameState.ActivePlayer.score += gameState.ActiveQuestion.points;
    gameState.ActivePlayer.answers++;
    await gameState.ActivePlayer.save();
    gameState.activePlayerId = null;
    updateGameState();
  });

  socket.on('wrongAnswer', async () => {
    console.log("received wrongAnswer()");
    gameState.ActivePlayer.score -= gameState.ActiveQuestion.points;
    await gameState.ActivePlayer.save();
    gameState.activePlayerId = null;
    updateGameState();
  });

  socket.on('setBuzzerTest', async (state) => {
    console.log("received setBuzzerTest("+state+")");
    gameState.buzzerTest = state;
    updateGameState();
  });

  socket.on('setSplashScreen', async (state) => {
    console.log("received setSplashScreen("+state+")");
    gameState.splashScreen = state;
    updateGameState();
  });

  socket.on('showSolution', async () => {
    console.log("received showSolution()");
    gameState.showSolution = true;
    updateGameState();
  });

  socket.on('setIndex', async (idx) => {
    console.log("received setIndex("+idx+")");
    io.emit('setIndex', idx);
  });

  socket.on('setSonglessRound', async (round) => {
    console.log("received setSonglessRound("+round+")");
    io.emit('setSonglessRound', round);
  });

  socket.on('updatePlayer', async (player) => {
    console.log("received updatePlayer("+player+")");
    
    try {
      // Update the game in the database
      var playerDb = await Player.findByPk(player.id);
      const previousBuzzer = playerDb.buzzer;
      playerDb.name = player.name;
      playerDb.score = player.score;
      playerDb.buzzer = normalizeBuzzerId(player.buzzer);
      await playerDb.save();

      const seatIndex = await getSeatIndexForPlayer(playerDb);
      await syncBuzzerToSeat(seatIndex, playerDb.buzzer);

      if (normalizeBuzzerId(previousBuzzer) !== normalizeBuzzerId(playerDb.buzzer)) {
        releaseBuzzerSlot(previousBuzzer);
      }
    } catch (error) {
      console.error('Error updating game state in DB:', error);
    }

    await updateGameState();
  });

  socket.on('playMedia', () => {
    io.emit('playMedia');
  });

  socket.on('pauseMedia', () => {
    io.emit('pauseMedia');
  });

  socket.on('stopMedia', () => {
    io.emit('stopMedia');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

let buzzers = [
  { name: '0', uniqueId: undefined, socket: undefined, color: 'LED 000 255 000' },
  { name: '1', uniqueId: undefined, socket: undefined, color: 'LED 255 000 000' },
  { name: '2', uniqueId: undefined, socket: undefined, color: 'LED 128 000 255' },
  { name: '3', uniqueId: undefined, socket: undefined, color: 'LED 128 255 000' },
];

let buzzerColors = [
  'LED 000 255 000',
  'LED 255 000 000',
  'LED 128 000 255',
  'LED 255 255 000'
]

const buzzerServer = net.createServer((socket) => {
  console.log('Buzzer connected:', socket.remoteAddress);

  // Get the buzzer's unique identifier (e.g., MAC address)
  const uniqueId = socket.remoteAddress; // You can replace this with MAC if you have it

  // Check if this buzzer was already connected before
  let buzzer = buzzers.find(b => b.uniqueId === uniqueId);
  if (!buzzer) {
    buzzer = buzzers.find(b => !b.uniqueId); // Find an unassigned buzzer slot
    if (buzzer) {
      buzzer.uniqueId = uniqueId;
      buzzer.socket = socket;

      // Assign the buzzer to the corresponding player
      assignBuzzerToPlayer(buzzer);
    } else {
      console.log('No available buzzer slots.');
      return;
    }
  } else {
    buzzer.socket = socket; // Reconnected buzzer
    assignBuzzerToPlayer(buzzer);
    console.log(`Buzzer reconnected: ${buzzer.name}`);
  }

  updateBuzzerStates();

  socket.on('data', (data) => handleBuzzerData(data, buzzer));
  socket.on('end', () => console.log(`Buzzer disconnected: ${buzzer.name}`));
  socket.on('error', (err) => console.error(`Socket error with ${buzzer.name}:`, err));
});

// Start the server
buzzerServer.listen(8080, '0.0.0.0', () => {
  console.log('Buzzer Server listening on port 8080');
});

// Assign a buzzer to a player based on the current round's players
async function assignBuzzerToPlayer(buzzer) {
  if (!gameState || !gameState.ActiveRound) return;

  const players = sortPlayersBySeat(gameState.ActiveRound.Players);
  const existingSeatIndex = players.findIndex((player) => player.buzzer === buzzer.uniqueId);
  const seatIndex = existingSeatIndex >= 0
    ? existingSeatIndex
    : players.findIndex((player) => !normalizeBuzzerId(player.buzzer));

  if (seatIndex < 0) {
    console.log(`No available player seats for buzzer ${buzzer.name}.`);
    return;
  }

  buzzer.color = buzzerColors[seatIndex];
  await syncBuzzerToSeat(seatIndex, buzzer.uniqueId);
  console.log(`Buzzer ${buzzer.name} assigned to seat ${seatIndex + 1} (${players[seatIndex].name})`);
  reloadGameState();  // Notify the UI about the new assignment
}

// Handle incoming data from a buzzer
function handleBuzzerData(data, buzzer) {
  const message = data.toString().trim();
  console.log(`${buzzer.name} sent: ${message}`);

  if (message === 'BUZZ') {
    handleBuzz(buzzer);
  }
}

async function handleBuzz(buzzer) {
  if (gameState && (gameState.ActiveQuestion || gameState.buzzerTest) && !gameState.ActivePlayer && !gameState.showSolution) {
    const player = gameState.ActiveRound.Players.find(p => p.buzzer === buzzer.uniqueId);
    if (player) {
      gameState.activePlayerId = player.id;
      io.emit('pauseMedia');
      await gameState.save();
      reloadGameState();  // Notify the UI about the buzz event
    }
  }
}

function updateBuzzerStates() {
  buzzers.forEach((b) => {
    if (b.socket !== undefined && gameState && (gameState.ActiveQuestion || gameState.buzzerTest) && !gameState.ActivePlayer) {
      b.socket.write(`${b.color}\n`);
    } else if(b.socket !== undefined && gameState && (gameState.ActiveQuestion || gameState.buzzerTest) && gameState.ActivePlayer.buzzer === b.uniqueId) {
      b.socket.write(`${b.color}\n`);
    } else if(b.socket !== undefined) {
      b.socket.write(`LED 000 000 000\n`);
    }
  });
}