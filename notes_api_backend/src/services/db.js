'use strict';

/**
 * MongoDB Connection Utility for Notes API Backend
 * 
 * Connects to MongoDB using Mongoose. The connection string and database name are read from environment variables.
 * Ensures only a single connection instance is reused.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;
const MONGODB_DB = process.env.MONGODB_DB;

/**
 * Connects to MongoDB using Mongoose, ensures singleton connection, and attaches listeners for monitoring.
 * @returns {Promise<mongoose.Connection>} The Mongoose connection instance.
 */
 // PUBLIC_INTERFACE
async function connectDB() {
  if (!MONGODB_URL) {
    throw new Error('Missing MONGODB_URL in environment variables');
  }
  if (!MONGODB_DB) {
    throw new Error('Missing MONGODB_DB in environment variables');
  }
  // Prevent multiple connections in dev/hot reload
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URL, {
      dbName: MONGODB_DB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    mongoose.connection.on('connected', () => {
      // Only log initial connection
      if (process.env.NODE_ENV !== 'test') {
        console.log(`MongoDB connected to ${MONGODB_DB}`);
      }
    });
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

module.exports = { connectDB };
