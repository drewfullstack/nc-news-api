const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const app = express();
const endpoints = require("./endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
  res.status(200).send(endpoints);
});

app.all("*", (request, response, next) => {
  response.status(404).send({ message: "endpoint not found" });
});

module.exports = app;
