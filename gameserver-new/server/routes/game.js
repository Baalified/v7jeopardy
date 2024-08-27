// server/routes/game.js
const express = require('express');
const { Game, Player, Round, Category, Question } = require('../db/index');

const router = express.Router();

// Get game data
router.get('/game', async (req, res) => {
  try {
    const game = await Game.findOne({
      include: [
        {
          model: Round,
          include: [
            Player, // Include players for each round
            {
              model: Category,
              include: [Question],
            },
          ],
        },
      ],
    });
    res.json(game);
  } catch (error) {
    console.error('Error fetching game data:', error);
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
});

module.exports = router;
