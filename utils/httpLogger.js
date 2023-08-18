const morgan = require("morgan");

// Override the stream method by telling
// Morgan to use our custom logger instead of the console.log.
const stream = {
  // Use the http severity
  write: (message) => logger.http(message),
};

// morgan middleware to stream HTTP logs to winston logger
const morganMiddleware = morgan("combined", { stream });

module.exports = morganMiddleware;
