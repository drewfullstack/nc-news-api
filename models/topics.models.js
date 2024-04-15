const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((body) => {
    return body.rows;
  });
};
