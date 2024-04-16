const { checkUserExists } = require("../models/users.models");
const {
  checkArticleExists,
  fetchComments,
} = require("../models/articles.models");
const {
  sendComment,
  removeComment,
  checkCommentExists,
} = require("../models/comments.models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const inputBodyFieldsArray = Object.keys(req.body);
  const fieldSchema = {
    username: "string",
    body: "string",
  };

  if (inputBodyFieldsArray.length !== 2) {
    return res.status(400).send({ status: 400, message: "invalid body" });
  }

  inputBodyFieldsArray.forEach((field) => {
    if (typeof req.body[field] !== fieldSchema[field]) {
      return res.status(400).send({ status: 400, message: "invalid body" });
    }
  });

  Promise.all([
    sendComment(body, article_id, username),
    checkUserExists(username),
    checkArticleExists(article_id),
  ])
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
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
exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  Promise.all([removeComment(comment_id), checkCommentExists(comment_id)])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
