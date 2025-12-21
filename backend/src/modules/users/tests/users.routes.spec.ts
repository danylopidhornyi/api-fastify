import Fastify from "fastify";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

const mockCreateUser = vi.fn(async (req, reply) => reply.code(201).send({}));
const mockGetUser = vi.fn(async (req, reply) => reply.send({}));
const mockGetAllUsers = vi.fn(async (req, reply) => reply.send([]));
const mockLoginUser = vi.fn(async (req, reply) =>
  reply.code(200).send({
    accessToken: "token-xyz",
    user: {
      id: "1",
      email: "alice@example.com",
    },
  }),
);
const mockAuthenticate = vi.fn(async (req, reply) => {
  req.user = { sub: "1", email: "alice@example.com" };
});

vi.mock("../users.controller.js", () => {
  return {
    UsersController: class {
      createUser = mockCreateUser;
      getUser = mockGetUser;
      getAllUsers = mockGetAllUsers;
      loginUser = mockLoginUser;
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
    app.decorate("authenticate", mockAuthenticate);
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
      },
    });
    expect(mockCreateUser).toHaveBeenCalled();
  });

  it("POST /login calls loginUser", async () => {
    await app.inject({
      method: "POST",
      url: "/login",
      payload: {
        email: "alice@example.com",
        password: "123456",
      },
    });
    expect(mockLoginUser).toHaveBeenCalled();
  });

  it("GET / calls getAllUsers", async () => {
    await app.inject({ method: "GET", url: "/" });
    expect(mockGetAllUsers).toHaveBeenCalled();
    expect(mockAuthenticate).toHaveBeenCalled();
  });

  it("GET /:id calls getUser and runs authenticate preHandler", async () => {
    await app.inject({ method: "GET", url: "/1" });
    expect(mockGetUser).toHaveBeenCalled();
    expect(mockAuthenticate).toHaveBeenCalled();
  });
});
