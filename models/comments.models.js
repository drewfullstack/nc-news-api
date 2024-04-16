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
