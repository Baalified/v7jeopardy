import React from 'react';
import './css/BuzzerTestButton.css';

function BuzzerTestButton({ gameState, onToggle }) {
  const handleClick = () => {
    onToggle(!gameState.buzzerTest); // Call the parent callback with the new state
  };

  return (
    <button 
      className={`buzzer-test-button ${gameState.buzzerTest ? 'active' : ''}`} 
      onClick={handleClick}
    >
      {gameState.buzzerTest ? 'Disable Buzzer Test' : 'Enable Buzzer Test'}
    </button>
  );
}

export default BuzzerTestButton;
