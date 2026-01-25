import { FastifyInstance, FastifyPluginAsync } from "fastify";
import userRoutes from "./users.routes.js";
import UserService from "./users.service.js";

const usersModule: FastifyPluginAsync = async (app: FastifyInstance) => {
  const userService = new UserService(app.prisma);
  app.decorate("userService", userService);
  await app.register(userRoutes);
};

export default usersModule;
