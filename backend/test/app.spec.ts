import { beforeAll, afterAll, describe, it, expect } from "vitest";
import { buildApp } from "../src/app.js";

let app: any;

beforeAll(async () => {
  app = await buildApp();
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe("app", () => {
  it("responds on GET / (200 or 404 are acceptable)", async () => {
    const res = await app.inject({ method: "GET", url: "/" });
    expect([200, 404]).toContain(res.statusCode);
  });
});
