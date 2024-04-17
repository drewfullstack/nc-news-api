const db = require("../db/connection.js");
exports.fetchArticle = (article_id) => {
  return db
    .query(
      "SELECT articles.*, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)::INT AS comment_count FROM articles WHERE article_id=$1;",
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
      return rows[0];
    });
};

exports.fetchArticles = (topic) => {
  let sqlStringQuery =
    "SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, (SELECT COUNT(*) FROM comments WHERE comments.article_id = articles.article_id)::INT AS comment_count FROM articles ";
  let queryValues = [];

  if (topic) {
    sqlStringQuery += "WHERE articles.topic = $1 ";
    queryValues.push(topic);
  }
  sqlStringQuery += "ORDER BY articles.created_at DESC";

  return db.query(sqlStringQuery, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.fetchComments = (article_id) => {
  return db
    .query(
      "SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;",
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
    });
};

exports.updateArticle = (article_id, inc_votes) => {
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
