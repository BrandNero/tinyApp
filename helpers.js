const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};
const checkRegistration = (email, password) => {
  if (email === "" || password === "") {
    return false;
  }
  return true;
};
const addUser = function(email, password) {
  const userID = generateRandomString();
  const newUser = {
    id: userID,
    email,
    password,
  };
  return newUser;
};
const checkPassword = (user, password) => {
  if (user.password === password) {
    return true;
  } else {
    return false;
  }
};
const findUserByEmail = function(email, users) {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
};
module.exports = {generateRandomString, checkRegistration, addUser, checkPassword, findUserByEmail};