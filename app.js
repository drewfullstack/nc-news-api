const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  getArticles,
  getComments,
} = require("./controllers/articles.controllers");
const endpoints = require("./endpoints.json");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

// PSQL ERROR HANDLERS
app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "invalid request" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ message: "invalid request" });
  }
  next(err);
});

// CUSTOM ERROR HANDLERS
app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  }
  next(err);
});

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
