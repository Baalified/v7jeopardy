// src/components/GameMaster.js
import React, { useEffect, useState } from 'react';

function GameMaster() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch('/api/game')
      .then((res) => res.json())
      .then((data) => setGame(data))
      .catch((err) => console.error('Error fetching game data:', err));
  }, []);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Game Master Control</h1>
      
      {/* Displaying Game Information */}
      <h2>Game: {game.name}</h2>

      {/* Iterate over each round in the game */}
      {game.Rounds.map((round) => (
        <div key={round.id}>
          <h3>Round {round.roundNumber}</h3>

          {/* List of players for the round */}
          <h4>Players:</h4>
          <ul>
            {round.Players.map((player) => (
              <li key={player.id}>
                {player.name} - {player.score} points
              </li>
            ))}
          </ul>

          {/* List of categories and questions */}
          <h4>Categories:</h4>
          <div>
            {round.Categories.map((category) => (
              <div key={category.id} style={{ marginBottom: '20px' }}>
                <h5>{category.name}</h5>
                <ul>
                  {category.Questions.map((question) => (
                    <li key={question.id}>
                      <strong>Question:</strong> {question.question} - <strong>Points:</strong> {question.points}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameMaster;
