const { fetchArticle, fetchArticles } = require("../models/articles.models");
const {
  checkArticleExists,
  updateArticle,
  uploadArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/topics.models");
const { checkUserExists } = require("../models/users.models");

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
  const { topic } = req.query;
  let { sort_by, order } = req.query;

  if (order) {
    order = order.toUpperCase();
  }

  if (topic) {
    Promise.all([fetchArticles(topic, sort_by, order), checkTopicExists(topic)])
      .then(([articles]) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchArticles(topic, sort_by, order)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
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

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  const inputBodyFieldsArray = Object.keys(req.body);
  const fieldSchema = {
    author: "string",
    title: "string",
    body: "string",
    topic: "string",
    article_img_url: "string",
  };

  if (inputBodyFieldsArray.length !== 4 && inputBodyFieldsArray.length !== 5) {
    return res.status(400).send({ status: 400, message: "invalid body" });
  }

  inputBodyFieldsArray.forEach((field) => {
    if (typeof req.body[field] !== fieldSchema[field]) {
      return res.status(400).send({ status: 400, message: "invalid body" });
    }
  });

  Promise.all([
    uploadArticle(author, title, body, topic, article_img_url),
    checkTopicExists(topic),
    checkUserExists(author),
  ])
    .then(([article]) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
