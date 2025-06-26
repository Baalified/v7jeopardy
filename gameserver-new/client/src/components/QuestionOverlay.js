// src/components/QuestionOverlay.js
import React, { useContext } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/QuestionOverlay.css";
import QuestionAnswerAudio from './QuestionAnswerAudio';
import QuestionAnswerImage from './QuestionAnswerImage';
import QuestionAnswerVideo from './QuestionAnswerVideo';
import QuestionControls from './QuestionControls';
import QuestionTypeAudio from './QuestionTypeAudio';
import QuestionTypeImage from './QuestionTypeImage';
import QuestionTypeText from './QuestionTypeText';
import QuestionTypeVideo from './QuestionTypeVideo';
import QuestionTypeSlides from './QuestionTypeSlides';

function QuestionOverlay({ question, activePlayer, buttonCorrect, buttonWrong, buttonReopen, buttonClose, buttonSolution, showSolution, socket }) {
  const { isGameMaster } = useContext(GameMasterContext);
  
  return (
    <div className="question-overlay">
      <div className="question-content-wrapper">
        <div className="question-content" >
          {(!showSolution && question.mediaType === 'text') && <QuestionTypeText question={question} />}
          {(!showSolution && question.mediaType === 'image') && <QuestionTypeImage question={question} />}
          {(!showSolution && question.mediaType === 'audio') && <QuestionTypeAudio question={question} socket={socket} />}
          {(!showSolution && question.mediaType === 'video') && <QuestionTypeVideo question={question} socket={socket} />}
          {(!showSolution && question.mediaType === 'slides') && <QuestionTypeSlides question={question} socket={socket} />}
          {(showSolution && question.answerMediaType === 'image') && <QuestionAnswerImage question={question} />}
          {(showSolution && question.answerMediaType === 'audio') && <QuestionAnswerAudio question={question} socket={socket} />}
          {(showSolution && question.answerMediaType === 'video') && <QuestionAnswerVideo question={question} socket={socket} />}
        </div>
        {isGameMaster && (<QuestionControls question={question}
                          activePlayer={activePlayer}
                          buttonCorrect={buttonCorrect}
                          buttonWrong={buttonWrong}
                          buttonReopen={buttonReopen}
                          buttonClose={buttonClose}
                          buttonSolution={buttonSolution}
                          socket={socket} />)}
      </div>
    </div>
  );
}

export default QuestionOverlay;
