import React, { useContext } from 'react';
import "./css/QuestionCell.css";
import { GameMasterContext } from '../context/GameMasterContext';

function QuestionCell({ question, onClick }) {
  const { isGameMaster } = useContext(GameMasterContext);

  return (
    <div 
      className={`question-cell ${question.played === true ? 'played' : ''} ${isGameMaster ? 'gm' : ''}`}
      onClick={isGameMaster ? onClick : null}
    >
      $ {question.points}
    </div>
  );
}

export default QuestionCell;
