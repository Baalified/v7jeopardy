// src/components/QuestionOverlay.js
import React, { useContext } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/QuestionOverlay.css";
import QuestionControls from './QuestionControls';
import QuestionTypeAudio from './QuestionTypeAudio';
import QuestionTypeImage from './QuestionTypeImage';
import QuestionTypeText from './QuestionTypeText';
import QuestionTypeVideo from './QuestionTypeVideo';

function QuestionOverlay({ question, activePlayer, buttonCorrect, buttonWrong, buttonReopen, buttonClose }) {
  const { isGameMaster } = useContext(GameMasterContext);
  
  return (
    <div className="question-overlay">
      <div className="question-content-wrapper">
        <div className="question-content" >
          {question.mediaType === 'text' && <QuestionTypeText question={question} />}
          {question.mediaType === 'image' && <QuestionTypeImage question={question} />}
          {question.mediaType === 'audio' && <QuestionTypeAudio question={question} />}
          {question.mediaType === 'video' && <QuestionTypeVideo question={question} />}
        </div>
        {isGameMaster && (<QuestionControls question={question}
                          activePlayer={activePlayer}
                          buttonCorrect={buttonCorrect}
                          buttonWrong={buttonWrong}
                          buttonReopen={buttonReopen}
                          buttonClose={buttonClose} />)}
      </div>
    </div>
  );
}

export default QuestionOverlay;
