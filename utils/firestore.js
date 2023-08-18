const Firestore = require("@google-cloud/firestore");

const db = new Firestore({
  projectId: "snipstack",
  keyFilename: "./config/serviceKey.json",
});

module.exports = db;
