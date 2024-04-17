const express = require("express");
const cookieParser = require("cookie-parser");
const {generateRandomString, addUser, checkRegistration, checkPassword} = require("./functions");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "monkey123"
  }
};


const findUserByEmail = function(email) {
  return Object.values(users).find(user => user.email === email);
};

///send you to the main page
app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//shows the urls
app.get("/urls", (req, res) => {
  const userID = req.cookies['userID'];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  const templateVars = { urls: urlDatabase, userID };
  res.render("urls_index", templateVars);
});
/// register page
app.get("/register", (req, res) => {
  const userID = req.cookies['userID'];
  let templateVars = { userID };
  res.render("register", templateVars);
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
  
  const newUser = addUser(req.body.email, req.body.password);
  users[newUser.id] = newUser;
  
  console.log("new User created", newUser);
  res.cookie("userID", newUser.id);
  res.redirect(`/urls`);
});
app.get("/login", (req, res) => {
  const userID = req.cookies['userID'];
  let templateVars = { userID };
  res.render("login", templateVars);
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = findUserByEmail(email);
  if (!user) {
    res.status(403).send("Email cannot be found");
    return;
  }
  if (!checkPassword(user, password)) {
    res.status(403).send("Wrong password");
    return;
  }
  console.log(user);
  res.cookie('userID', user.id);
  res.redirect("/urls");
});
//for you to create urls
app.get("/urls/new", (req, res) => {
  const userID = req.cookies['userID'];
  if (!userID) {
    res.redirect("/login");
    return;
  }
  res.render("urls_new", { userID });
});
///show the new created shorturl
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.cookies['userID'];
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  
  if (!userID) {
    res.send("Please login to view this page");
    res.redirect("/login");
    return;
  }
  
  if (!urlEntry) {
    res.status(404).send("URL not found");
    return;
  }
  
  const templateVars = { shortURL, longURL: urlEntry.longURL, userID };
  res.render("urls_show", templateVars);
});
///will show now in the urls page
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = { longURL, userID: req.cookies.userID };
  console.log("Long URL:", longURL);
  res.redirect(`/urls/${shortURL}`);
});
///shows the urls
app.get("/urls/:id", (req, res) => {
  const userID = req.cookies['userID'];
  const shortURL = req.params.id;
  const longURL = urlDatabase[shortURL];
  if (!userID) {
    return res.status(403).send("Please login to see this URL");
  }
  if (!longURL) {
    return res.status(403).send("Error: URL not found");
  }
  if (longURL.userID !== userID) {
    return res.status(403).send("Error: You don't own this URL");
  }
  const templateVars = { shortURL, longURL, userID };
  res.render("urls_show", templateVars);
});
///for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const userID = req.cookies['userID'];
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  
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
  const userID = req.cookies['userID'];
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
  res.cookie("userID", userID);
  res.redirect("/urls");
});
/// sends you to the longURL
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const urlEntry = urlDatabase[shortURL];
  if (!urlEntry) {
    res.status(404).send("Short URL not found");
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
app.post("/logout", (req, res) => {
  res.clearCookie("userID");
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});