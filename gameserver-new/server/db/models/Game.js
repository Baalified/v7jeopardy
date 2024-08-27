// db/models/Game.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Game', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
    activeRoundId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rounds', // This references the 'Rounds' table
        key: 'id',
      },
      allowNull: true, // It can be null initially
    },
    activeQuestionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Questions', // This references the 'Rounds' table
        key: 'id',
      },
      allowNull: true, // It can be null initially
    },
    activePlayerId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Players', // This references the 'Rounds' table
        key: 'id',
      },
      allowNull: true, // It can be null initially
    },
  });
};
