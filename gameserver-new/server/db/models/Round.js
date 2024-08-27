// db/models/Round.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Round', {
    roundNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};
