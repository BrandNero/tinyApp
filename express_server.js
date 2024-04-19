const express = require("express");
const cookieSession = require("cookie-session");
const {users, urlDatabase} = require("./data/database");
const {generateRandomString, addUser, checkRegistration, findUserByEmail} = require("./helpers");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 8080; // default port 8080
 
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession({
  name: "session",
  keys: ["key1", "key2"]
}));

///send you to the main page
app.get("/", (req, res) => {
  res.redirect(302, "/login");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//shows the urls
app.get("/urls", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    res.redirect(302, "/login");
    return;
  }
  const userUrls = Object.values(urlDatabase).filter(url => url.userID === userID);
  const templateVars = { urls: userUrls, userID };
  res.render("urls_index", templateVars);
});

/// register page
app.get("/register", (req, res) => {
  const userID = req.session.userID;
  let templateVars = { userID };
  res.render("register", templateVars);
});

/////registering email and password to a newUser
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password);
  const user = Object.values(users);
  if (!checkRegistration(email, hashedPassword)) {
    res.status(403).send("Invalid email or password");
    return;
  }
  if (findUserByEmail(email, user)) {
    res.status(403).send("Email already in use");
    return;
  }

  const newUser = addUser(req.body.email, hashedPassword);
  users[newUser.id] = newUser;
  req.session.userID = newUser.email;
  res.redirect(`/urls`);
});

//show the users when login
app.get("/login", (req, res) => {
  const userID = req.session.userID;
  let templateVars = { userID };
  res.render("login", templateVars);
});

//makes sure the user exist when login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const uservalue = Object.values(users);
  const user = findUserByEmail(email, uservalue);
  if (!user) {
    res.status(403).send("Invalid email");
    return;
  }
  if (!bcrypt.compareSync(password, user.password)) {
    res.status(403).send("Invalid password");
    return;
  }
  req.session.userID = user.email;
  res.redirect(200, "/urls");
});

//for you to create urls
app.get("/urls/new", (req, res) => {
  const userID = req.session.userID;
  if (!userID) {
    res.redirect(302, "/login");
    return;
  }
  res.render("urls_new", { userID });
});

///show the new created shorturl
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (!userID) {
    res.status(403).send("Please login to see this URL");
    return;
  }
  if (!urlEntry) {
    res.status(404).send("URL not found");
    return;
  }
  if (urlEntry.userID !== userID) {
    res.status(403).send("You don't have permission to see this URL");
    return;
  }
  const templateVars = { shortURL, longURL: urlEntry.longURL, userID };
  res.render("urls_show", templateVars);
});

///will show now in the urls page
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: req.session.userID,
    shortURL: shortURL
  };
  res.redirect("/urls");
});

///shows the urls
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (!userID) {
    res.status(403).send("Please login to see this URL");
    return;
  }
  if (!urlEntry) {
    res.status(404).send("URL not found");
    return;
  }
  if (urlEntry.userID !== userID) {
    res.status(403).send("You don't have permission to see this URL");
    return;
  }
  const templateVars = { shortURL, longURL: urlEntry.longURL, userID };
  res.render("urls_show", templateVars);
});

///for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  console.log(urlEntry);
  if (!userID) {
    res.status(403).send("Please login to delete this URL");
    return;
  }
  if (!urlEntry) {
    res.status(404).send("URL not found");
    return;
  }
  if (urlEntry.userID !== userID) {
    res.status(403).send("You don't have permission to delete this URL");
    return;
  }
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// updates the shorturl
app.post("/urls/:shortURL/update", (req, res) => {
  const userID = req.session.userID;
  const shortURL = req.params.shortURL;
  const newURL = req.body.newURL;
  const urlEntry = urlDatabase[shortURL];
  if (!userID) {
    res.status(403).send("Please login to update this URL");
    return;
  }
  if (!urlEntry) {
    res.status(404).send("URL not found");
    return;
  }
  if (urlEntry.userID !== userID) {
    res.status(403).send("You don't have permission to update this URL");
    return;
  }
  urlEntry.longURL = newURL;
  res.redirect(`/urls`);
});

/// cookies
app.post("/login", (req, res) => {
  const userID = req.body.userID;
  req.session.userID = userID;
  res.redirect("/urls");
});

/// sends you to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (!urlEntry) {
    res.status(200).send("Short URL not found");
    return;
  }
  let longURL = urlEntry.longURL;
  if (longURL.startsWith('http://')) {
    longURL = 'https://' + longURL.slice(7);
  }
  if (!longURL.startsWith('https://')) {
    longURL = 'https://' + longURL;
  }
  res.redirect(longURL);
});
//logs you out
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});
//makes sure the servers starts
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});