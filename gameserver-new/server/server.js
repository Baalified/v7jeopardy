// server/server.js
const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');
const { Game, Player, Round, Category, Question } = require('./db/index');

const server = http.createServer(app);
const io = socketIo(server);

var gameState = undefined;

// WebSocket connection
io.on('connection', async (socket) => {
  const reloadGameState = async function() {
    gameState = await Game.findOne({
      include: [
        { model: Round, as: 'ActiveRound' },
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
    
    // Sort questions manually after fetching
    gameState.Rounds.forEach((round) => {
      round.Categories.forEach((category) => {
        category.Questions.sort((a, b) => a.points - b.points);
      });
    });
    
    io.emit('gameState', gameState);
  };

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
      }
    } catch (error) {
      console.error('Error updating game state in DB:', error);
    }

    updateGameState();
  });

  socket.on('setActivePlayer', async (playerId) => {
    console.log("received setActivePlayer("+playerId+")");
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

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
