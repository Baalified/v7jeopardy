import React from 'react';
import './css/BuzzerTestButton.css';

function BuzzerTestButton({ gameState, onToggle, onToggleSplash, onPlayIntro }) {
  const handleClick = () => {
    onToggle(!gameState.buzzerTest); // Call the parent callback with the new state
  };

  const handleClickSplash = () => {
    onToggleSplash(!gameState.splashScreen); // Call the parent callback with the new state
  };

  const handlePlayIntro = () => {
    onPlayIntro(); // Call the parent callback with the new state
  };

  return (
    <>
    {!gameState.splashScreen && (<button 
      className={`buzzer-test-button ${gameState.buzzerTest ? 'active' : ''}`} 
      onClick={handleClick}
    >
      {gameState.buzzerTest ? 'Disable Buzzer Test' : 'Enable Buzzer Test'}
    </button>)}

    {gameState.splashScreen && (<button 
      className={`play-intro-button`} 
      onClick={handlePlayIntro}
    >
      Play Intro
    </button>)}
    
    <button 
      className={`buzzer-test-button ${gameState.splashScreen ? 'active' : ''}`} 
      onClick={handleClickSplash} style={{bottom: "80px"}}
    >
      {gameState.splashScreen ? 'Hide Splash Screen' : 'Show Splash Screen'}
    </button>
    </>
  );
}

export default BuzzerTestButton;
