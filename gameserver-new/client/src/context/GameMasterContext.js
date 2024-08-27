import React, { createContext, useState } from 'react';

// Create the context
export const GameMasterContext = createContext();

// Create a provider component
export const GameMasterProvider = ({ children }) => {
  // This state will be shared across all components
  const [isGameMaster, setIsGameMaster] = useState(false);

  return (
    <GameMasterContext.Provider value={{ isGameMaster, setIsGameMaster }}>
      {children}
    </GameMasterContext.Provider>
  );
};
