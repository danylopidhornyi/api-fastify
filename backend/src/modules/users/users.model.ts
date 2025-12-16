import { FastifyInstance } from "fastify";
import userRoutes from "./users.routes.js";

export const UserModel = (app: FastifyInstance) => {
  app.register(userRoutes, { prefix: "/api/users" });
};
