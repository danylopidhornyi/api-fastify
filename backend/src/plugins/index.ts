import type { FastifyInstance } from "fastify";
import { swaggerPlugin } from "./swagger.plugin.js";
import { PrismaClient } from "@prisma/client";

import usersModule from "../modules/users/index.js";
import productsModule from "../modules/products/index.js";
import transactionsModule from "../modules/transactions/index.js";

export const registerPlugins = async (app: FastifyInstance) => {
  // Register jwt plugin
  await app.register(import("./jwt.plugin.js"));

  // Initialize Prisma Client
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate("prisma", prisma);

  // Attach modules for tests and external access
  app.decorate("usersModule", usersModule);
  app.decorate("productsModule", productsModule);
  app.decorate("transactionsModule", transactionsModule);

  // Register Swagger plugin
  await app.register(swaggerPlugin);

  // Graceful shutdown
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};
