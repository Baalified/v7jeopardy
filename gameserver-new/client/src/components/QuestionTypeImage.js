// src/components/QuestionTypeImage.js
import React from 'react';
import "./css/QuestionTypeImage.css";

function QuestionTypeImage({ question }) {
  return (
    <div className="question-image">
      <img src={question.mediaUrl} alt="question" />
    </div>
  );
}

export default QuestionTypeImage;
