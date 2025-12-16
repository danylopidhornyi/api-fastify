import { FastifyInstance } from "fastify";
import transactionRoutes from "./transactions.routes.js";

export const TransactionModel = (app: FastifyInstance) => {
  app.register(transactionRoutes, { prefix: "/api/transactions" });
};
