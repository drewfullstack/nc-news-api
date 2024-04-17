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

articlesRouter.get("/", getArticles);

articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
