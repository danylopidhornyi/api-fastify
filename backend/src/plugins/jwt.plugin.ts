import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import { FastifyInstance, FastifyRequest } from "fastify";

async function jwtPlugin(app: FastifyInstance) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  await app.register(jwt, {
    secret: process.env.JWT_SECRET,
    sign: {
      expiresIn: "1h",
    },
  });

  app.decorate("authenticate", async function (request: FastifyRequest) {
    await request.jwtVerify();
  });
}

export default fp(jwtPlugin);
