const bcrypt = require("bcryptjs");

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("monkey123")
  }
};
module.exports = users;