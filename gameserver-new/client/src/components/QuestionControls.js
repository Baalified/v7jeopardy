// src/components/QuestionControls.js
import React, { useState, useEffect } from 'react';
import "./css/QuestionControls.css";

function QuestionControls({ question, activePlayer, buttonCorrect, buttonWrong, buttonReopen, buttonClose, buttonSolution, socket }) {
  const [currentRound, setCurrentRound] = useState(1);

  useEffect(() => {
    // Listen for round changes from server
    const handleRoundChange = (round) => {
      setCurrentRound(round);
    };

    socket.on('setSonglessRound', handleRoundChange);

    return () => {
      socket.off('setSonglessRound', handleRoundChange);
    };
  }, [socket]);

  const handlePlay = () => {
    socket.emit('playMedia');
  };

  const handlePause = () => {
    socket.emit('pauseMedia');
  };

  const handleStop = () => {
    socket.emit('stopMedia');
  };

  const handleRoundChange = (round) => {
    socket.emit('setSonglessRound', round);
  };

  return (
    <div className="question-controls">
      {(question.mediaType === 'audio' || question.mediaType === 'video' || question.mediaType === 'songless') && (
        <div className="question-media-controls">
          <button onClick={handlePlay} className="media-button play">
            <i className="fas fa-play"></i>
          </button>
          <button onClick={handlePause} className="media-button pause">
            <i className="fas fa-pause"></i>
          </button>
          <button onClick={handleStop} className="media-button stop">
            <i className="fas fa-fast-backward"></i>
          </button>
        </div>
      )}
      {question.mediaType === 'songless' && (
        <div className="question-songless-round-controls">
          <div className="round-controls-label">Round:</div>
          <div className="round-buttons">
            {[1, 2, 3, 4, 5, 6].map((round) => (
              <button
                key={round}
                onClick={() => handleRoundChange(round)}
                className={`round-button ${currentRound === round ? 'active' : ''}`}
              >
                {round}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="question-answer">
        {question.answer}
      </div>
      <div className="question-buttons">
        <button className={`control-button correct ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonCorrect: null}>Correct Answer</button>
        <button className={`control-button wrong ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonWrong : null}>Wrong Answer</button>
        <button className={`control-button reopen ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonReopen : null}>Reopen Question</button>
        {question.answerMediaType && (<button className={`control-button solution`} onClick={buttonSolution}>Show Solution</button>)}
        <button className={`control-button close`} onClick={buttonClose}>Close Question</button>
      </div>
    </div>
  );
}

export default QuestionControls;
