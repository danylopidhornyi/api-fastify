import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { TransactionsController } from "./transactions.controller.js";

const transactionRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  if (!app.prisma || !app.transactionService) {
    throw new Error("Prisma or TransactionService not initialized");
  }
  const controller = new TransactionsController(app.transactionService);
  app.post(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Transactions"],
        summary: "Create a new transaction",
        body: {
          type: "object",
          required: ["user_id", "product_id", "amount", "type"],
          properties: {
            user_id: { type: "string", format: "uuid" },
            product_id: { type: "string", format: "uuid" },
            amount: {
              type: "number",
              minimum: 0,
              maximum: 1000,
              format: "float",
            },
            type: { type: "string", enum: ["credit", "debit"] },
          },
        },
        response: {
          201: {
            description: "Transaction successfully created",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              user_id: { type: "string", format: "uuid" },
              product_id: { type: "string", format: "uuid" },
              amount: { type: "number" },
              type: { type: "string", enum: ["credit", "debit"] },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.createTransaction,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Get transaction by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            description: "Transaction details",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              user_id: { type: "string", format: "uuid" },
              product_id: { type: "string", format: "uuid" },
              amount: { type: "number" },
              type: { type: "string", enum: ["credit", "debit"] },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.getTransaction,
  );

  app.get(
    "/",
    {
      schema: {
        tags: ["Transactions"],
        summary: "Get all transactions",
        response: {
          200: {
            description: "List of transactions",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                user_id: { type: "string", format: "uuid" },
                amount: { type: "number" },
                type: { type: "string", enum: ["credit", "debit"] },
                created_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    controller.getAllTransactions,
  );

  app.get(
    "/user/:user_id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Transactions"],
        summary: "Get transactions by User ID",
        params: {
          type: "object",
          properties: {
            user_id: { type: "string", format: "uuid" },
          },
        },
        response: {
          200: {
            description: "List of user's transactions",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                user_id: { type: "string", format: "uuid" },
                product_id: { type: "string", format: "uuid" },
                amount: { type: "number" },
                type: { type: "string", enum: ["credit", "debit"] },
                created_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    controller.getTransactionsByUserId,
  );
};

export default transactionRoutes;
