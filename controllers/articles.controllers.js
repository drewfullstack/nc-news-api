const { fetchArticle } = require("../models/articles.models");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;

  let regex = /\d/;
  if (!regex.test(article_id)) {
    res.status(400).send({ message: "invalid request" });
  }

  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
