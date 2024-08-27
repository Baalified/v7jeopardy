// src/components/QuestionCell.js
import React from 'react';

function QuestionCell({ question, onClick }) {
  return (
    <div className="question-cell" onClick={onClick}>
      ${question.points}
    </div>
  );
}

export default QuestionCell;
