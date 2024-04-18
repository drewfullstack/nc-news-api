const express = require("express");
const {
  getArticle,
  getArticles,
  patchArticle,
  postArticle,
} = require("../controllers/articles.controllers");
const {
  postComment,
  getComments,
  deleteComment,
} = require("../controllers/comments.controller");
const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);

articlesRouter.post("/", postArticle);

articlesRouter.route("/:article_id").get(getArticle).patch(patchArticle);

articlesRouter
  .route("/:article_id/comments")
  .get(getComments)
  .post(postComment);

module.exports = articlesRouter;
