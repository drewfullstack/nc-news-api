const express = require("express");
const {
  deleteComment,
  patchComment,
} = require("../controllers/comments.controller");
const commentsRouter = express.Router();

commentsRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);

module.exports = commentsRouter;
