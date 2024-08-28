// src/components/BuzzerTestOverlay.js
import React, { useContext } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/BuzzerTestOverlay.css";

function BuzzerTestOverlay({ activePlayer, buttonReopen }) {
  const { isGameMaster } = useContext(GameMasterContext);
  
  return (
    <div className="buzzertest-overlay">
      <div className="buzzertest-content-wrapper">
        <div className="buzzertest-content" >
          Buzzer Test
        </div>
        {isGameMaster && (
          <div className="buzzertest-controls">
            <div className="buzzertest-buttons">
              <button className={`control-button reopen ${!activePlayer ? 'disabled' : ''}`} onClick={activePlayer ? buttonReopen : null}>Reopen Question</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BuzzerTestOverlay;
