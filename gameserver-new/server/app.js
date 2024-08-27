// server/app.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { sequelize } = require('./db/index');
const gameRoutes = require('./routes/game');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api', gameRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Export the app without starting the server
module.exports = app;
