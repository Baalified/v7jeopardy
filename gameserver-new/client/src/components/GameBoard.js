// src/components/GameBoard.js
import React, { useState } from 'react';
import Category from './Category';
import './GameBoard.css';

function GameBoard({ game }) {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
  };

  const closeOverlay = () => {
    setSelectedQuestion(null);
  };

  return (
    <div className="game-board">
      <div className="categories-grid">
        {game.Rounds[0].Categories.map((category) => (
          <Category
            key={category.id}
            category={category}
            onQuestionClick={handleQuestionClick}
          />
        ))}
      </div>

      <div className="players-info">
        {game.Rounds[0].Players.map((player) => (
          <div key={player.id} className={`player ${game.activePlayerId === player.id ? 'active' : ''}`}>
            <div className="player-name">{player.name}</div>
            <div className="player-score">{player.score} points</div>
          </div>
        ))}
      </div>

      {selectedQuestion && (
        <div className="question-overlay" onClick={closeOverlay}>
          <div className="question-content">
            {selectedQuestion.mediaType === 'text' && <div className="question-text">{selectedQuestion.question}</div>}
            {selectedQuestion.mediaType === 'image' && <img src={selectedQuestion.mediaUrl} alt="question" />}
            {selectedQuestion.mediaType === 'audio' && <audio controls src={selectedQuestion.mediaUrl} />}
            {selectedQuestion.mediaType === 'video' && <video controls src={selectedQuestion.mediaUrl} />}
          </div>
        </div>
      )}
    </div>
  );
}

export default GameBoard;
