// src/components/QuestionTypeText.js
import React from 'react';
import "./css/QuestionTypeText.css";

function QuestionTypeText({ question }) {
  return (
    <div className="question-text">{question.question}</div>
  );
}

export default QuestionTypeText;
