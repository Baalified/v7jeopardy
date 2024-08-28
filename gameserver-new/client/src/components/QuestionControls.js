// src/components/QuestionControls.js
import React from 'react';
import "./css/QuestionControls.css";

function QuestionControls({ question, activePlayer, buttonCorrect, buttonWrong, buttonReopen, buttonClose, socket }) {

  const handlePlay = () => {
    socket.emit('playMedia');
  };

  const handlePause = () => {
    socket.emit('pauseMedia');
  };

  const handleStop = () => {
    socket.emit('stopMedia');
  };

  return (
    <div className="question-controls">
      {(question.mediaType === 'audio' || question.mediaType === 'video') && (
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
      <div className="question-answer">
        {question.answer}
      </div>
      <div className="question-buttons">
        <button className={`control-button correct ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonCorrect: null}>Correct Answer</button>
        <button className={`control-button wrong ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonWrong : null}>Wrong Answer</button>
        <button className={`control-button reopen ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonReopen : null}>Reopen Question</button>
        <button className={`control-button close`} onClick={buttonClose}>Close Question</button>
      </div>
    </div>
  );
}

export default QuestionControls;
