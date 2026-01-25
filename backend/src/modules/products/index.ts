import { FastifyInstance, FastifyPluginAsync } from "fastify";
import productRoutes from "./products.routes.js";
import ProductsService from "./products.service.js";

const productsModule: FastifyPluginAsync = async (app: FastifyInstance) => {
  const productsService = new ProductsService(app.prisma);
  app.decorate("productsService", productsService);
  await app.register(productRoutes, { prefix: "/api/products" });
};

export default productsModule;
