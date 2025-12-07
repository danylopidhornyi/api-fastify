import { UsersService } from "../user/users.service.js";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    userService: UsersService;
    prisma: PrismaClient;
  }
}
