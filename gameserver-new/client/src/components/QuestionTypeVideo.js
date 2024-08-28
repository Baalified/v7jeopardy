// src/components/QuestionTypeVideo.js
import React, { useRef, useContext, useEffect } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/QuestionTypeVideo.css";

function QuestionTypeVideo({ question, socket }) {
  const videoRef = useRef(null);
  const { isGameMaster } = useContext(GameMasterContext);

  useEffect(() => {
    socket.on('playMedia', () => {
      if (videoRef.current) {
        videoRef.current.play();
      }
    });

    socket.on('pauseMedia', () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    });

    socket.on('stopMedia', () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    });

    socket.on('syncMedia', (currentTime) => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime;
        videoRef.current.play();
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
    <div className="question-video">
      <video ref={videoRef} muted={isGameMaster} preload="auto">
        <source src={question.mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default QuestionTypeVideo;
