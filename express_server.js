const { Template } = require("ejs");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "monkey123"
  }
};

const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};
const findUserByEmail = function(email) {
  return Object.values(users).find(user => user.email === email);
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
    email: email,
    password: password
  };
  return newUser.id;
};
///send you to the main page
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
/// cookies
app.post("/login", (req, res) => {
  const userID = req.body.userID;
  res.cookie("userID", userID);
  res.redirect("/urls");
});
app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//shows the urls
app.get("/urls", (req, res) => {
  const userID = req.cookies['userID'];
  const TemplateVars = { urls: urlDatabase, userID};
  res.render("urls_index", TemplateVars);
});
/// register page
app.get("/register", (req, res) => {
  res.render("register");
});
/////registering email and password to a newUser
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!checkRegistration(email, password)) {
    res.status(400).send("Invalid email or password");
    return;
  }
  if (findUserByEmail(email)) {
    res.status(400).send("Email already in use");
    return;
  }

  const userInfo = {
    email: email,
    password: password
  };
  const newUser = addUser(userInfo);

  // Assuming users is your user database
  users[newUser.id] = newUser;

  console.log("new User created", newUser);
  res.cookie("userID", newUser);
  res.redirect(`/urls`);
});
//for you to create urls
app.get("/urls/new", (req, res) => {
  const userID = {userID: req.cookies['userID']};
  res.render("urls_new", userID);
});
///show the new created shorturl
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['userID'];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], userID };
  res.render("urls_show", templateVars);
});
///will show now in the urls page
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.send(res.redirect(`urls/${shortURL}`));
});
///shows the urls
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies['userID'];
  const TemplateVars = { id: req.params.id, longURL:urlDatabase[req.params.shortURL], userID};
  res.render("urls_show", TemplateVars);
});
///for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// updates the shorturl
app.post("/urls/:shortURL/update", (req, res) => {
  const shortURL = req.params.shortURL;
  const newURL = req.body.newURL;
  urlDatabase[shortURL] = newURL;
  res.redirect(`/urls`);
});
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  console.log(longURL);
  if (longURL.startsWith('http://')) {
    longURL = 'https://' + longURL.slice(7);
  } else if (!longURL.startsWith('https://')) {
    longURL = 'https://' + longURL;
  }
  res.redirect(longURL);
});
app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});