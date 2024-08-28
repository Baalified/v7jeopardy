// src/components/GameBoard.js
import React, { useState, useEffect, useContext } from 'react';
import Category from './Category';
import Player from './Player';
import './css/GameBoard.css';
import QuestionOverlay from './QuestionOverlay';
import BuzzerTestButton from './BuzzerTestButton';
import BuzzerTestOverlay from './BuzzerTestOverlay';
import { GameMasterContext } from '../context/GameMasterContext';

function GameBoard({ game, socket }) {
  const [previousActivePlayerId, setPreviousActivePlayerId] = useState(null);
  const buzzerSound = new Audio('/resources/buzzer.wav');
  const { isGameMaster } = useContext(GameMasterContext);

  useEffect(() => {
    if(isGameMaster)
      return;
    if (game.ActivePlayer && game.ActivePlayer.id !== previousActivePlayerId) {
      buzzerSound.play();
      setPreviousActivePlayerId(game.ActivePlayer.id);
    } else if(!game.ActivePlayer) {
      setPreviousActivePlayerId(null);
    }
  }, [game.ActivePlayer, previousActivePlayerId, buzzerSound]);

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

  const updatePlayer = (player) => {
    socket.emit("updatePlayer", player);
  }

  const buzzerTest = (state) => {
    socket.emit("setBuzzerTest", state)
  }

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
          <Player player={player}
                  isActivePlayer={game.ActivePlayer && game.ActivePlayer.id === player.id}
                  onclick={setActivePlayer}
                  onUpdatePlayer={updatePlayer} />
        ))}
      </div>

      {game.ActiveQuestion && (
        <QuestionOverlay question={game.ActiveQuestion}
                          activePlayer={game.ActivePlayer}
                          buttonCorrect={correctAnswer}
                          buttonWrong={wrongAnswer}
                          buttonReopen={unsetActivePlayer}
                          buttonClose={closeOverlay}
                          socket={socket}
                          />
      )}

      {game.buzzerTest && (
        <BuzzerTestOverlay activePlayer={game.ActivePlayer} buttonReopen={unsetActivePlayer} />
      )}

      {isGameMaster && (
        <BuzzerTestButton gameState={game} onToggle={buzzerTest} />
      )}
    </div>
  );
}

export default GameBoard;
