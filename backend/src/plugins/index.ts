import type { FastifyInstance } from "fastify";
import { PrismaClient } from "../../prisma/client/index.js";
import UserService from "../modules/users/users.service.js";
import { swaggerPlugin } from "./swagger.plugin.js";

export const registerPlugins = async (app: FastifyInstance) => {
  const prisma = new PrismaClient();
  await prisma.$connect();
  app.decorate("prisma", prisma);
  
  const userService = new UserService(prisma);
  app.decorate('userService', userService);
  
  await app.register(swaggerPlugin);
  
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
};
