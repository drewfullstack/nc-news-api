const db = require("../db/connection.js");

exports.sendComment = (body, article_id, username) => {
  return db
    .query(
      "INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *",
      [body, article_id, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id]);
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query("SELECT * FROM comments WHERE comment_id=$1", [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
    });
};

exports.updateComment = (comment_id, inc_votes) => {
  return db
    .query(
      "UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *",
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
