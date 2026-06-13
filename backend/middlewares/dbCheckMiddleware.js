const mongoose = require("mongoose");

/**
 * Middleware to check if MongoDB is connected.
 * Returns 503 if DB is not available, helpful for development without MONGO_URI.
 */
const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: "Service Unavailable",
      message:
        "Database is not connected. Please set MONGO_URI in your environment variables.",
    });
  }
  next();
};

module.exports = checkDBConnection;
