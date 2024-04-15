const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
