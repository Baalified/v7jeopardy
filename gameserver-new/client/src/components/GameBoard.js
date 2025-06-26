// src/components/GameBoard.js
import React, { useState, useEffect, useContext } from 'react';
import Category from './Category';
import Player from './Player';
import './css/GameBoard.css';
import QuestionOverlay from './QuestionOverlay';
import BuzzerTestButton from './BuzzerTestButton';
import BuzzerTestOverlay from './BuzzerTestOverlay';
import LoadRoundButton from './LoadRoundButton';
import { GameMasterContext } from '../context/GameMasterContext';

function GameBoard({ game, socket }) {
  const [previousActivePlayerId, setPreviousActivePlayerId] = useState(null);
  const [previousActiveRoundId, setPreviousActiveRoundId] = useState(null);
  const [preloadMedia, setPreloadMedia] = useState([]);
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

  useEffect(() => {
    if(game.ActiveRound && game.ActiveRound.id !== previousActiveRoundId && game.ActiveRound.Categories) {
      setPreviousActiveRoundId(game.ActiveRound.id);
      game.ActiveRound.Categories.forEach(category => {
        category.Questions.forEach(question => {
          if (question.mediaUrl) {
            if(preloadMedia.find(m => m.mediaUrl === question.mediaUrl))
              return;

            if (question.mediaType === 'image') {
              setPreloadMedia(prev => [...prev, 
                                        preloadImage(question.mediaUrl)
                                      ]);
            } else if (question.mediaType === 'audio' || question.mediaType === 'video') {
              setPreloadMedia(prev => [...prev, 
                                        preloadMultimedia(question.mediaType, question.mediaUrl)
                                      ]);
            }

            if (question.answerMediaType === 'image') {
              setPreloadMedia(prev => [...prev, 
                                        preloadImage(question.answerMediaUrl)
                                      ]);
            } else if (question.answerMediaType === 'audio' || question.answerMediaType === 'video') {
              setPreloadMedia(prev => [...prev, 
                                        preloadMultimedia(question.answerMediaType, question.answerMediaUrl)
                                      ]);
            }
          }
        });
      });
      console.log(preloadMedia);
    }
  }, [game.ActiveRound]);

  const preloadImage = (imageUrl) => {
    const img = new Image();
    img.src = imageUrl;
    return img;
  };

  const preloadMultimedia = (mediaType, mediaUrl) => {
    const media = document.createElement(mediaType);
    media.src = mediaUrl;
    media.preload = 'auto'; // Preload entire media
    media.onloadeddata = () => console.log(`${mediaType} loaded: ${mediaUrl}`);
    media.load(); // Force loading
    // Optionally add media to DOM hidden to ensure loading in some browsers
    document.body.appendChild(media);
    media.style.display = 'none';
    return media;
  };

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

  const showSolution = () => {
    socket.emit("showSolution");
  }

  const buzzerTest = (state) => {
    socket.emit("setBuzzerTest", state)
  }

  const handleRoundChange = (roundId) => {
    socket.emit("setActiveRound", roundId);
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
          <Player player={player}
                  isActivePlayer={game.ActivePlayer && game.ActivePlayer.id === player.id}
                  onclick={setActivePlayer}
                  onUpdatePlayer={updatePlayer} />
        ))}
      </div>

      {game.ActiveQuestion && (
        <QuestionOverlay  question={game.ActiveQuestion}
                          activePlayer={game.ActivePlayer}
                          buttonCorrect={correctAnswer}
                          buttonWrong={wrongAnswer}
                          buttonReopen={unsetActivePlayer}
                          buttonClose={closeOverlay}
                          buttonSolution={showSolution}
                          socket={socket}
                          showSolution={game.showSolution}
                          />
      )}

      {game.buzzerTest && (
        <BuzzerTestOverlay activePlayer={game.ActivePlayer} buttonReopen={unsetActivePlayer} />
      )}

      {isGameMaster && (
        <>
          <BuzzerTestButton gameState={game} onToggle={buzzerTest} />
          <LoadRoundButton
              rounds={game.Rounds}
              activeRoundId={game.ActiveRound.id}
              onRoundChange={handleRoundChange}
            />
        </>
      )}
    </div>
  );
}

export default GameBoard;
