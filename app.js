const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("./controllers/articles.controllers");

const {
  postComment,
  getComments,
  deleteComment,
} = require("./controllers/comments.controller");
const endpoints = require("./endpoints.json");
const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

// PSQL ERROR HANDLERS
app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ message: "invalid request" });
  }
  if (err.code === "22P02") {
    res.status(400).send({ message: "invalid request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ message: "not found" });
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
