const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

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
