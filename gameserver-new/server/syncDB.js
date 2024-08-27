// syncDB.js
const { sequelize } = require('./db/index');

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true }); // force: true will drop the table if it already exists
    console.log('Database synced successfully!');
  } catch (error) {
    console.error('Error syncing database:', error);
  } finally {
    process.exit();
  }
}

syncDatabase();
