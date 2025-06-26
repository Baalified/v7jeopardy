// src/components/LoadRoundButton.js
import React, { useState } from 'react';
import './css/LoadRoundButton.css';

function LoadRoundButton({ rounds, activeRoundId, onRoundChange }) {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleRoundClick = (roundId) => {
    onRoundChange(roundId);
    setMenuVisible(false); // Hide the menu after selecting a round
  };

  return (
    <div className="load-round-container">
      <button
        className="load-round-button"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        Load Round
      </button>
      {menuVisible && (
        <div className="load-round-menu">
          {rounds.map((round) => (
            <div
              key={round.id}
              className={`round-item ${round.id === activeRoundId ? 'active' : ''}`}
              onClick={() => handleRoundClick(round.id)}
            >
              {round.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LoadRoundButton;
