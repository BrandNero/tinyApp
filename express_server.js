const { Template } = require("ejs");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
///send you to the main page
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
/// cookies
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
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
  const username = req.cookies['username'];
  const TemplateVars = { urls: urlDatabase, username};
  res.render("urls_index", TemplateVars);
});
//for you to create urls
app.get("/urls/new", (req, res) => {
  const username = {username: req.cookies['username']};
  res.render("urls_new", username);
});
///show the new created shorturl
app.get("/urls/:shortURL", (req, res) => {
  const username = req.cookies['username'];
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], username };
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
  const username = req.cookies['username'];
  const TemplateVars = { id: req.params.id, longURL:urlDatabase[req.params.shortURL], username};
  res.render("urls_show", TemplateVars);
});
///for deleting urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});
// updates the url
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
  res.clearCookie("username");
  res.redirect("/urls");
});

