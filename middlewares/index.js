const express = require("express");
const boom = require("express-boom");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
const morganMiddleware = require("../utils/httpLogger.js");

const middleware = (app) => {
  // Load vars from .env to process.env
  dotenv.config();

  // Middleware for sending error responses with express response object. To be required above all middlewares
  app.use(boom());

  // Initialise logging middleware
  app.use(morganMiddleware);

  // Request parsing middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Middleware to add security headers. Few headers have been disabled as it does not serve any purpose for the API.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      dnsPrefetchControl: false,
      ieNoOpen: false,
      referrerPolicy: false,
      xssFilter: false,
    }),
  );

  // Configure CORS
  app.use(
    cors({
      origin: "http://localhost:1212",
      credentials: true,
      optionsSuccessStatus: 200,
    }),
  );
};

module.exports = middleware;
