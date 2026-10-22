import request from "supertest";

import { describe, expect, it } from "vitest";

import { createApp } from "./app";

const app = createApp();

describe("GET /health", () => {
  it("returns status ok and a request id", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);

    expect(res.body.status).toBe("ok");

    expect(res.headers["x-request-id"]).toBeDefined();
  });
});

describe("unknown routes", () => {
  it("return a json 404", async () => {
    const res = await request(app).get("/nope");

    expect(res.status).toBe(404);

    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});

describe("invalid json body", () => {
  it("returns a json 400", async () => {
    const res = await request(app)
      .post("/v1/anything")

      .set("content-type", "application/json")

      .send("{bad");

    expect(res.status).toBe(400);

    expect(res.body.error.code).toBe("BAD_REQUEST");
  });
});
