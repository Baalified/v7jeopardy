// src/components/GameBoard.js
import React, { useState } from 'react';
import Category from './Category';
import Player from './Player';
import './css/GameBoard.css';
import QuestionOverlay from './QuestionOverlay';

function GameBoard({ game, socket, isGameMaster }) {
  const [overlayStyle, setOverlayStyle] = useState({});

  const handleQuestionClick = (question) => {
    socket.emit("setActiveQuestion", question.id);
  };

  const closeOverlay = () => {
    socket.emit("setActiveQuestion", null);
  };

  const setActivePlayer = (player) => {
    socket.emit("setActivePlayer", player.id);
  }

  const unsetActivePlayer = () => {
    socket.emit("setActivePlayer", null);
  };

  const correctAnswer = () => {
    socket.emit("correctAnswer", null);
  };

  const wrongAnswer = () => {
    socket.emit("wrongAnswer", null);
  };

  return (
    <div className="game-board">
      <div className="categories-grid">
        {game.ActiveRound.Categories.map((category) => (
          <Category
            key={category.id}
            category={category}
            onQuestionClick={handleQuestionClick}
          />
        ))}
      </div>

      <div className="players-info">
        {game.ActiveRound.Players.map((player) => (
          <Player player={player} isActivePlayer={game.ActivePlayer && game.ActivePlayer.id === player.id} onclick={setActivePlayer} />
        ))}
      </div>

      {game.ActiveQuestion && (
        <QuestionOverlay question={game.ActiveQuestion}
                          activePlayer={game.ActivePlayer}
                          buttonCorrect={correctAnswer}
                          buttonWrong={wrongAnswer}
                          buttonReopen={unsetActivePlayer}
                          buttonClose={closeOverlay}
                          />
      )}
    </div>
  );
}

export default GameBoard;
