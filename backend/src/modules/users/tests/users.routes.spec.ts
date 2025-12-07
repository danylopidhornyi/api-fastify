import Fastify from "fastify";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

const mockCreateUser = vi.fn(async (req, reply) => reply.code(201).send({}));
const mockGetUser = vi.fn(async (req, reply) => reply.send({}));
const mockGetAllUsers = vi.fn(async (req, reply) => reply.send([]));

vi.mock("../users.controller.js", () => {
  return {
    UsersController: class {
      createUser = mockCreateUser;
      getUser = mockGetUser;
      getAllUsers = mockGetAllUsers;
    },
  };
});

import userRoutes from "../users.routes.js";

describe("userRoutes", () => {
  let app: Fastify.FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    app.decorate("prisma", {});
    app.decorate("userService", {});
    await app.register(userRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it("POST / calls createUser", async () => {
    await app.inject({
      method: "POST",
      url: "/",
      payload: {
        email: "alice@example.com",
        password: "123456",
        name: "Alice",
      },
    });
    expect(mockCreateUser).toHaveBeenCalled();
  });

  it("GET / calls getAllUsers", async () => {
    await app.inject({ method: "GET", url: "/" });
    expect(mockGetAllUsers).toHaveBeenCalled();
  });

  it("GET /:id calls getUser", async () => {
    await app.inject({ method: "GET", url: "/1" });
    expect(mockGetUser).toHaveBeenCalled();
  });
});
