const bcrypt = require("bcryptjs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("monkey123", 10)
  }
};
const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.minecraft.com",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};
module.exports = {users, urlDatabase};