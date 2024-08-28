// src/App.js
import React, { useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import GameBoard from './components/GameBoard';
import { GameMasterContext } from './context/GameMasterContext';
import '@fortawesome/fontawesome-free/css/all.min.css';

const socket = io.connect();

function App() {
  const [gameState, setGameState] = useState(null);
  const { isGameMaster, setIsGameMaster } = useContext(GameMasterContext);

  useEffect(() => {
    if (window.location.pathname.includes('/gm')) {
      setIsGameMaster(true);
    }
  }, [setIsGameMaster]);

  useEffect(() => {
    // Set up the socket listener once when the component mounts
    socket.on('gameState', (state) => {
      console.log('Received game state from server:', state);
      setGameState(state);
    });

    return () => {
      // Cleanup the socket listener when the component unmounts
      socket.off('gameState');
    };
  }, []);

  useEffect(() => {
    if (gameState && !gameState.ActiveRound && gameState.Rounds.length > 0) {
      // Only set the active round once gameState is fully updated
      socket.emit("setActiveRound", gameState.Rounds[0].id);
    }
  }, [gameState]);

  if (!gameState || !gameState.ActiveRound) {
    return <div style={{color: 'white'}}>Loading...</div>;
  }

  return (
    <div className="App">
      <GameBoard game={gameState} socket={socket} />
    </div>
  );
}

export default App;
