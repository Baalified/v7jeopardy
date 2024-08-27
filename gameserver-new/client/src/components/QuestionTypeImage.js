// src/components/QuestionTypeImage.js
import React from 'react';
import "./css/QuestionTypeImage.css";

function QuestionTypeImage({ question }) {
  return (
    <img src={question.mediaUrl} alt="question" />
  );
}

export default QuestionTypeImage;
