import type { FastifyInstance } from "fastify";
import { PrismaClient } from "../../prisma/client/index.js";
import UserService from "../modules/users/users.service.js";
import { swaggerPlugin } from "./swagger.plugin.js";
import TransactionService from "../modules/transactions/transactions.service.js";
import ProductsService from "../modules/products/products.service.js";

export const registerPlugins = async (app: FastifyInstance) => {
  // Initialize Prisma Client
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate("prisma", prisma);

  // Register services
  const userService = new UserService(prisma);
  app.decorate("userService", userService);

  const transactionService = new TransactionService(prisma);
  app.decorate("transactionService", transactionService);

  const productsService = new ProductsService(prisma);
  app.decorate("productsService", productsService);

  // Register Swagger plugin
  await app.register(swaggerPlugin);

  // Graceful shutdown
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};
