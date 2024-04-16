const db = require("../db/connection.js");

exports.checkUserExists = (username) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "not found" });
      }
    });
};

exports.fetchUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users;")
    .then(({ rows }) => {
      return rows;
    });
};
