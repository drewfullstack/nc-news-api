const {
  fetchArticle,
  fetchArticles,
  fetchComments,
  checkArticleExists,
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

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([fetchComments(article_id), checkArticleExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
