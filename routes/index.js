const express = require("express");
const snippet = require("./snippets.js");

const app = express();

app.use("/snippet", snippet);

module.exports = app;
