import Fastify from "fastify";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

const mockCreateTransaction = vi.fn(async (req, reply) =>
  reply.code(201).send({}),
);

const mockGetTransaction = vi.fn(async (req, reply) => reply.send({}));

const mockGetAllTransactions = vi.fn(async (req, reply) => reply.send([]));

const mockGetTransactionsByUserId = vi.fn(async (req, reply) => reply.send([]));

vi.mock("../transactions.controller.js", () => {
  return {
    TransactionsController: class {
      createTransaction = mockCreateTransaction;
      getTransaction = mockGetTransaction;
      getAllTransactions = mockGetAllTransactions;
      getTransactionsByUserId = mockGetTransactionsByUserId;
    },
  };
});

import transactionRoutes from "../transactions.routes.js";

describe("transactionRoutes", () => {
  let app: Fastify.FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    app.decorate("prisma", {});
    app.decorate("transactionService", {});
    await app.register(transactionRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it("POST / calls createTransaction", async () => {
    await app.inject({
      method: "POST",
      url: "/",
      payload: {
        amount: 100,
        type: "credit",
        user_id: "b1f5f6e1-3c4e-4d2e-9f7a-8f9e8c6d7c3a",
        product_id: "57ac8c93-5708-454e-9f44-d163fceff742",
      },
    });
    expect(mockCreateTransaction).toHaveBeenCalled();
  });

  it("GET / calls getAllTransactions", async () => {
    await app.inject({ method: "GET", url: "/" });
    expect(mockGetAllTransactions).toHaveBeenCalled();
  });

  it("GET /user/:userId calls getTransactionsByUserId", async () => {
    await app.inject({
      method: "GET",
      url: "/user/b1f5f6e1-3c4e-4d2e-9f7a-8f9e8c6d7c3a",
    });
    expect(mockGetTransactionsByUserId).toHaveBeenCalled();
  });

  it("GET /:id calls getTransaction", async () => {
    await app.inject({
      method: "GET",
      url: "/2504f6de-d6db-4197-98e0-339e9ed1d9f3",
    });
    expect(mockGetTransaction).toHaveBeenCalled();
  });
});
