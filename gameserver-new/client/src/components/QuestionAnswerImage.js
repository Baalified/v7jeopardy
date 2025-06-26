// src/components/QuestionAnswerImage.js
import React from 'react';
import "./css/QuestionTypeImage.css";

function QuestionAnswerImage({ question }) {
  return (
    <div className="question-image">
      <img src={question.answerMediaUrl} alt="question" />
    </div>
  );
}

export default QuestionAnswerImage;
