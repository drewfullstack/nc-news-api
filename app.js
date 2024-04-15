const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  getArticles,
} = require("./controllers/articles.controllers");
const endpoints = require("./endpoints.json");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  }
  next(err);
});

module.exports = app;
