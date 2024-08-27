// src/components/QuestionTypeAudio.js
import React from 'react';
import "./css/QuestionTypeAudio.css";

function QuestionTypeAudio({ question }) {
  return (
    <audio controls src={question.mediaUrl} />
  );
}

export default QuestionTypeAudio;
