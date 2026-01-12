// src/components/QuestionTypeSongless.js
import React, { useRef, useContext, useEffect, useState } from 'react';
import { GameMasterContext } from '../context/GameMasterContext';
import "./css/QuestionTypeSongless.css";

const ROUND_DURATIONS = {
  1: 0.1,   // 0.1 seconds
  2: 0.5,   // 0.5 seconds
  3: 1,     // 2 seconds
  4: 2,     // 4 seconds
  5: 4,     // 8 seconds
  6: 10     // 15 seconds
};

function QuestionTypeSongless({ question, socket }) {
  const audioRef = useRef(null);
  const { isGameMaster } = useContext(GameMasterContext);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const currentRoundRef = useRef(1);

  // Update ref when round changes
  useEffect(() => {
    currentRoundRef.current = currentRound;
  }, [currentRound]);

  // Format time for display
  const formatTime = (seconds) => {
    if (seconds < 1) {
      return `${seconds.toFixed(2)}s`;
    }
    return `${seconds.toFixed(1)}s`;
  };

  // Socket event handlers - set up once
  useEffect(() => {
    // Listen for round changes from server
    const handleRoundChange = (round) => {
      setCurrentRound(round);
      currentRoundRef.current = round;
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
        // Auto-play when round changes (per user requirement)
        audioRef.current.play().catch(err => {
          console.error('Error auto-playing audio:', err);
        });
      }
    };

    socket.on('setSonglessRound', handleRoundChange);

    // Standard media control handlers
    socket.on('playMedia', () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
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
        setCurrentTime(0);
      }
    });

    return () => {
      socket.off('setSonglessRound', handleRoundChange);
      socket.off('playMedia');
      socket.off('pauseMedia');
      socket.off('stopMedia');
    };
  }, [socket]);

  // Set up timeupdate handler to stop at round duration and update display
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const round = currentRoundRef.current;
        const duration = ROUND_DURATIONS[round];
        const currentAudioTime = audioRef.current.currentTime;
        
        // Update displayed time
        setCurrentTime(currentAudioTime);
        
        // Stop at round duration
        if (duration && currentAudioTime >= duration) {
          audioRef.current.pause();
          audioRef.current.currentTime = duration;
          setCurrentTime(duration);
        }
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  const maxDuration = ROUND_DURATIONS[currentRound];

  return (
    <div className="question-songless">
      <div className="question-songless-duration">
        {formatTime(currentTime)} / {formatTime(maxDuration)}
      </div>
      <div className="question-audio-placeholder">
        <i className="fas fa-volume-up"></i>
      </div>
      <audio ref={audioRef} muted={isGameMaster}>
        <source src={question.mediaUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default QuestionTypeSongless;
