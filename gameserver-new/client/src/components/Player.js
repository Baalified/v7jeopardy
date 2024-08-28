import React, { useContext, useState, useEffect } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/Player.css";

function Player({ player, isActivePlayer, onclick, onUpdatePlayer }) {
  const { isGameMaster } = useContext(GameMasterContext);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(player.name);
  const [editedScore, setEditedScore] = useState(player.score);
  const [editedBuzzer, setEditedBuzzer] = useState(player.buzzer);

  useEffect(() => {
    setEditedName(player.name);
    setEditedScore(player.score);
    setEditedBuzzer(player.buzzer);
  }, [player]);

  const handleSave = () => {
    onUpdatePlayer({
      ...player,
      name: editedName,
      score: editedScore,
      buzzer: editedBuzzer,
    });
    setIsEditing(false);
  };

  return (
    <div key={player.id} className={`player ${isActivePlayer ? 'active' : ''} ${isGameMaster ? 'gm' : ''}`} onClick={() => {if(!isEditing) onclick(player);}}>
      {isGameMaster && !isEditing && (
        <i 
          className="fas fa-pen edit-icon" 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering player click
            setIsEditing(true);
          }}>
        </i>
      )}
      {isGameMaster && isEditing ? (
        <div className="player-edit-form">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="player-edit-input"
            placeholder="Name"
          />
          <input
            type="number"
            value={editedScore}
            onChange={(e) => setEditedScore(Number(e.target.value))}
            className="player-edit-input"
            placeholder="Score"
          />
          <input
            type="text"
            value={editedBuzzer}
            onChange={(e) => setEditedBuzzer(e.target.value)}
            className="player-edit-input"
            placeholder="Buzzer"
          />
          <div className="player-edit-buttons">
            <button onClick={handleSave} className="player-edit-button save">Save</button>
            <button onClick={() => setIsEditing(false)} className="player-edit-button cancel">Cancel</button>
          </div>
        </div>
      ) : (
        <div>
          <div className="player-name">{player.name}</div>
          <div className="player-score">$ {player.score}</div>
          {isGameMaster && (
            <div className="player-buzzer">
              Buzzer: {player.buzzer || 'Not Assigned'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Player;
