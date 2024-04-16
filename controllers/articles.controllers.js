const { fetchArticle, fetchArticles } = require("../models/articles.models");
const {
  checkArticleExists,
  updateArticle,
} = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  const inputBodyFieldsArray = Object.keys(req.body);
  const fieldSchema = {
    inc_votes: "number",
  };

  if (inputBodyFieldsArray.length !== 1) {
    return res.status(400).send({ status: 400, message: "invalid body" });
  }

  inputBodyFieldsArray.forEach((field) => {
    if (typeof req.body[field] !== fieldSchema[field]) {
      return res.status(400).send({ status: 400, message: "invalid body" });
    }
  });

  Promise.all([
    updateArticle(article_id, inc_votes),
    checkArticleExists(article_id),
  ])
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
