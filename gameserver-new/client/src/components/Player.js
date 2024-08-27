// src/components/Player.js
import React, { useContext } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/Player.css";

function Player({ player, isActivePlayer, onclick }) {
  const { isGameMaster } = useContext(GameMasterContext);

  return (
    <div key={player.id} className={`player ${isActivePlayer ? 'active' : ''} ${isGameMaster ? 'gm' : ''}`} onClick={() => onclick(player)}>
      <div className="player-name">{player.name}</div>
      <div className="player-score">{player.score} points</div>
    </div>
  );
}

export default Player;
