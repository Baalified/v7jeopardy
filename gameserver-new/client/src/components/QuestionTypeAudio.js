// src/components/QuestionTypeAudio.js
import React, { useRef, useContext, useEffect } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/QuestionTypeAudio.css";

function QuestionTypeAudio({ question, socket }) {
  const audioRef = useRef(null);
  const { isGameMaster } = useContext(GameMasterContext);

  useEffect(() => {
    socket.on('playMedia', () => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    });

    socket.on('pauseMedia', () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    });

    socket.on('stopMedia', () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    });

    socket.on('syncMedia', (currentTime) => {
      if (audioRef.current) {
        audioRef.current.currentTime = currentTime;
        audioRef.current.play();
      }
    });

    return () => {
      socket.off('playMedia');
      socket.off('pauseMedia');
      socket.off('stopMedia');
      socket.off('syncMedia');
    };
  }, []);

  return (
    <div className="question-audio">
      <div className="question-audio-placeholder">
        <i className="fas fa-volume-up"></i>
      </div>
      <audio ref={audioRef} muted={isGameMaster} controls>
        <source src={question.mediaUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default QuestionTypeAudio;
