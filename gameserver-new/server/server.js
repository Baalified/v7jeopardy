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
      { model: Question, as: 'ActiveQuestion' },
      { model: Player, as: 'ActivePlayer' },
      {
        model: Round,
        include: [
          {
            model: Category,
            include: [ Question ],
          },
          {
            model: Player, // Include players for each round
          },
        ],
      },
    ]
  });

  var activeRound = null;

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
  }
  
  updateBuzzerStates();
  
  io.emit('gameState', {...gameState.toJSON(), ActiveRound: activeRound});
};

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
    gameState.activeRoundId = roundId;
    updateGameState();
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

    updateGameState();
  });

  socket.on('setActivePlayer', async (playerId) => {
    console.log("received setActivePlayer("+playerId+")");
    if(playerId != null) {
      if(gameState.ActivePlayer || (!gameState.ActiveQuestion && !gameState.buzzerTest)) {
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

  socket.on('updatePlayer', async (player) => {
    console.log("received updatePlayer("+player+")");
    
    try {
      // Update the game in the database
      var playerDb = await Player.findByPk(player.id);
      playerDb.name = player.name;
      playerDb.score = player.score;
      playerDb.buzzer = player.buzzer;
      playerDb.save();
    } catch (error) {
      console.error('Error updating game state in DB:', error);
    }

    updateGameState();
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

  const players = gameState.ActiveRound.Players;

  for(var i=0; i<players.length; i++) {
    if(players[i] && (!players[i].buzzer || players[i].buzzer == '' || players[i].buzzer == buzzer.uniqueId)) {
      buzzer.color = buzzerColors[i];
      players[i].buzzer = buzzer.uniqueId;
      console.log(`Buzzer ${buzzer.name} assigned to player ${players[i].name}`);
      await players[i].save(); // Persist the assignment in the DB
      reloadGameState();  // Notify the UI about the new assignment
      break;
    }
  }
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
  if (gameState && (gameState.ActiveQuestion || gameState.buzzerTest) && !gameState.ActivePlayer) {
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