require('dotenv').config();
const mongoose = require('mongoose');

// The connection string is kept in .env (and in Render's environment settings),
// so the database password is never pushed to GitHub.
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI).catch(err => console.log('Mongoose connection error:', err.message));

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

require('./cake');
require('./order');
require('./user');
