const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/not-valid-endpoint", () => {
  test("status: 404 - responds with an error for any non existent endpoints", () => {
    return request(app)
      .get("/api/not-valid-endpoint")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("endpoint not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("status: 200 - responds with an array of topics, each with a slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("status: 200 - responds with an array of topics, each with all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toEqual(endpoints);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status: 200 - responds with an article of the given id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
      });
  });
  test("status: 404 - responds with 404 not found for an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/9999999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("status: 400 - responds with 400 invalid request for an invalid id", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid request");
      });
  });
});

describe("GET /api/articles", () => {
  test("status: 200 - responds with an array of all articles, sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
          expect(article.body).toBeUndefined();
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status: 200 - responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
        body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("status: 200 - responds with 200 for an article with no comments", () => {
    return request(app)
      .get("/api/articles/7/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(0);
      });
  });
  test("status: 404 - responds with 404 not found for an article id that does not exist", () => {
    return request(app)
      .get("/api/articles/99999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("status: 400 - responds with 400 invalid request for an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("invalid request");
      });
  });
});

// POST
describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201 - responds with created comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a great article",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("This is a great article");
        expect(comment.article_id).toBe(7);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.votes).toBe(0);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("status: 404 - responds with 404 if article does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a great article!",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("status: 404 - responds with 404 if username does not exist", () => {
    const newComment = {
      username: "not-a-username",
      body: "This is a great article!",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("not found");
      });
  });
  test("status: 400 - responds with error for incorrect body shape", () => {
    const newComment = {
      body: "new comment with no username",
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid body");
      });
  });
  test("status: 400 - responds with error for invalid data type in body", () => {
    const newComment = {
      username: 123,
      body: 123,
    };
    return request(app)
      .post("/api/articles/7/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid body");
      });
  });
  test("status: 400 - responds with error for invalid data type in id parameter", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a great article",
    };
    return request(app)
      .post("/api/articles/abc/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid request");
      });
  });
});

// PATCH
describe("PATCH /api/articles/:article_id", () => {
  test("status: 200 - responds with patched article with positive votes", () => {
    const newArticleVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(newArticleVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(3);
        expect(article.votes).toBe(10);
      });
  });
  test("status: 200 - responds with patched article with negative votes", () => {
    const newArticleVotes = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/3")
      .send(newArticleVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(3);
        expect(article.votes).toBe(-10);
      });
  });
  test("status: 404 - responds with 404 if article does not exist", () => {
    const newArticleVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(newArticleVotes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("not found");
      });
  });
  test("status: 400 - responds with error for incorrect body shape", () => {
    const newArticleVotes = {};
    return request(app)
      .patch("/api/articles/3")
      .send(newArticleVotes)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid body");
      });
  });
  test("status: 400 - responds with error for invalid data type in body", () => {
    const newArticleVotes = {
      inc_votes: "10",
    };
    return request(app)
      .patch("/api/articles/7")
      .send(newArticleVotes)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid body");
      });
  });
  test("status: 400 - responds with error for invalid data type in id parameter", () => {
    const newArticleVotes = {
      inc_votes: 10,
    };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(newArticleVotes)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("invalid request");
      });
  });
});
