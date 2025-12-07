import Fastify from "fastify";
import { registerPlugins } from "./plugins/index.js";
import userRoutes from "./modules/users/users.routes.js";

export async function buildApp() {
  const app = Fastify({ logger: true });

  await registerPlugins(app);

  await app.register(userRoutes, { prefix: '/api/users' });

  
  app.get('/', async function (request, reply) {
    return { hello: 'world' }
  })
  
  return app;
}