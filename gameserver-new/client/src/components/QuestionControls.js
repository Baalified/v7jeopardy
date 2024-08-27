// src/components/QuestionControls.js
import React from 'react';
import "./css/QuestionControls.css";

function QuestionControls({ question, activePlayer, buttonCorrect, buttonWrong, buttonReopen, buttonClose }) {
  return (
    <div className="question-controls">
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
