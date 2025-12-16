import Fastify from "fastify";
import { registerPlugins } from "./plugins/index.js";
import userRoutes from "./modules/users/users.routes.js";
import transactionRoutes from "./modules/transactions/transactions.routes.js";
import { productRoutes } from "./modules/products/products.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerPlugins(app);

  await app.register(userRoutes, { prefix: "/api/users" });

  await app.register(transactionRoutes, { prefix: "/api/transactions" });

  await app.register(productRoutes, { prefix: "/api/products" });

  app.get("/", async function (request, reply) {
    return { hello: "world" };
  });

  return app;
}
