import { FastifyInstance } from "fastify";

export const swaggerPlugin = async (app: FastifyInstance) => {
  await app.register(import('@fastify/swagger'));
  await app.register(import('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: (request, reply, next) => next(),
      preHandler: (request, reply, next) => next()
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true
  });
};