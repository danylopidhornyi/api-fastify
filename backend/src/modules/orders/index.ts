import { FastifyInstance, FastifyPluginAsync } from "fastify";
import OrdersService from "./orders.service.js";
import ordersRoutes from "./orders.routes.js";

const ordersModule: FastifyPluginAsync = async (app: FastifyInstance) => {
  const ordersService = new OrdersService(app.prisma);
  app.decorate("ordersService", ordersService);
  await app.register(ordersRoutes, { prefix: "/api/orders" });
};

export default ordersModule;
