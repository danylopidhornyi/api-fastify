import { FastifyInstance } from "fastify";

export const ProductModel = (app: FastifyInstance) => {
  app.register(productRoutes, { prefix: "/api/products" });
};
