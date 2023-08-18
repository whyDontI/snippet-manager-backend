const bcrypt = require("bcrypt");

const saltRounds = 10;

const encrypt = (value) => bcrypt.hash(value, saltRounds);

const compare = (value, hash) => bcrypt.compare(value, hash);

module.exports = {
  encrypt,
  compare,
};
