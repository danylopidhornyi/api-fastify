import Fastify from "fastify";
import { registerPlugins } from "./plugins/index.js";
import transactionsModule from "./modules/transactions/index.js";
import usersModule from "./modules/users/index.js";
import productsModule from "./modules/products/index.js";
import ordersModule from "./modules/orders/index.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerPlugins(app);

  await app.register(usersModule, { prefix: "/api/users" });
  await app.register(transactionsModule, { prefix: "/api/transactions" });
  await app.register(productsModule, { prefix: "/api/products" });
  await app.register(ordersModule, { prefix: "/api/orders" });

  app.get("/", async function (request, reply) {
    return { hello: "world" };
  });

  return app;
}
