// db/models/Question.js
module.exports = (sequelize) => {
  const { DataTypes } = require('sequelize');
  return sequelize.define('Question', {
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mediaType: {
      type: DataTypes.STRING,
      allowNull: true, // 'text', 'image', 'audio', 'video'
    },
    mediaUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mediaUrls  : {                       // <— NEW
      type     : DataTypes.JSON,         // JSON → TEXT in SQLite
      allowNull: true,
      defaultValue: []
    },
    played: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
};
