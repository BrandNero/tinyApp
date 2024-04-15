const { Template } = require("ejs");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
const generateRandomString = function() {
  let randomString = "";
  for (let i = 0; i < 6; i++) {
    const randomCharCode = Math.floor(Math.random() * 26 + 97);
    const randomChar = String.fromCharCode(randomCharCode);
    randomString += randomChar;
  }
  return randomString;
};

app.use(express.urlencoded({ extended: true }));
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};
app.get("/", (req, res) => {
  res.send("Hello!");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
app.get("/urls", (req, res) => {
  const TemplateVars = { urls: urlDatabase};
  res.render("urls_index", TemplateVars);
});
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_shows", templateVars);
});
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.send(res.redirect(`urls/${shortURL}`));
});
app.get("/urls/:id", (req, res) => {
  const TemplateVars = { id: req.params.id, longURL:urlDatabase[req.params.shortURL]};
  res.render("urls_shows", TemplateVars);
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
