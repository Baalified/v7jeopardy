// db/models/Game.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Game', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    currentRound: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  });
};
