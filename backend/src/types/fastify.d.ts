import { UsersService } from "../user/users.service.js";
import { TransactionService } from "../transactions/transactions.service.js";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    userService: UsersService;
    transactionService: TransactionService;
    prisma: PrismaClient;
  }
}
