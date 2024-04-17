const express = require("express");
const {
  getArticle,
  getArticles,
  patchArticle,
} = require("../controllers/articles.controllers");
const {
  postComment,
  getComments,
  deleteComment,
} = require("../controllers/comments.controller");
const articlesRouter = express.Router();

articlesRouter.get("/:article_id", getArticle);

articlesRouter.get("/", getArticles);

articlesRouter.patch("/:article_id", patchArticle);

articlesRouter.get("/:article_id/comments", getComments);

articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
