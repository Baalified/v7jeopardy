// db/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/config.js');

const sequelize = new Sequelize(config.development);

// Import models
const Player = require('./models/Player')(sequelize);
const Game = require('./models/Game')(sequelize);
const Round = require('./models/Round')(sequelize);
const Category = require('./models/Category')(sequelize);
const Question = require('./models/Question')(sequelize);

// Associations
Game.hasMany(Round);
Round.belongsTo(Game);

Round.hasMany(Category);
Category.belongsTo(Round);

Category.hasMany(Question);
Question.belongsTo(Category);

Round.hasMany(Player);
Player.belongsTo(Round);

// Export sequelize and models
module.exports = {
  sequelize,
  Player,
  Game,
  Round,
  Category,
  Question,
};
