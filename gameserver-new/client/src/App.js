// src/App.js
import React, { useEffect, useState } from 'react';
import GameBoard from './components/GameBoard';

function App() {
  const [game, setGame] = useState(null);

  useEffect(() => {
    fetch('/api/game')
      .then((res) => res.json())
      .then((data) => setGame(data))
      .catch((err) => console.error('Error fetching game data:', err));
  }, []);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <GameBoard game={game} />
    </div>
  );
}

export default App;
