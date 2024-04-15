const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const request = require("supertest");
const app = require("../app.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/not-valid-endpoint", () => {
  test("status: 404 - responds with with an error for any non existent endpoints", () => {
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
  test("status: 200 - responds with with an array of topics, each with a slug and description", () => {
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
  test("status: 200 - responds with with an array of topics, each with all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body).toBe("object");
        expect(body).toEqual(endpoints);
      });
  });
});
