const { Template } = require("ejs");
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

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
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
const a = 1;
app.get("/set", (req, res) => {
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
app.get("/urls", (req, res) => {
  const TemplateVars = { urls: urlDatabase};
  res.render("urls_index", TemplateVars);
});

app.get("/urls/:id", (req, res) => {
  const TemplateVars = { id: req.params.id, longURL:"http://localhost:8080/urls/b2xVn2"};
  res.render("urls_shows", TemplateVars);
});