// db/models/Round.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Round', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
