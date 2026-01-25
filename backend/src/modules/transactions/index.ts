import { FastifyInstance, FastifyPluginAsync } from "fastify";
import transactionRoutes from "./transactions.routes.js";
import TransactionService from "./transactions.service.js";

const transactionsModule: FastifyPluginAsync = async (app: FastifyInstance) => {
  const transactionService = new TransactionService(app.prisma);
  app.decorate("transactionService", transactionService);
  await app.register(transactionRoutes, { prefix: "/api/transactions" });
};

export default transactionsModule;
