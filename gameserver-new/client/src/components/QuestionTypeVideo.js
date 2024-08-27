// src/components/QuestionTypeVideo.js
import React from 'react';
import "./css/QuestionTypeVideo.css";

function QuestionTypeVideo({ question }) {
  return (
    <video controls src={question.mediaUrl} />
  );
}

export default QuestionTypeVideo;
