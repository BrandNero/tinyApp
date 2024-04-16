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
///send you to the main page
app.get("/", (req, res) => {
  res.redirect("/urls");
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});
//shows the urls
app.get("/urls", (req, res) => {
  const TemplateVars = { urls: urlDatabase};
  res.render("urls_index", TemplateVars);
});
//for you to create urls
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
///show the new created shorturl
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_shows", templateVars);
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
  const TemplateVars = { id: req.params.id, longURL:urlDatabase[req.params.shortURL]};
  res.render("urls_shows", TemplateVars);
});
///for deleting urls
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
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
