import { UsersService } from "../user/users.service.js";
import { TransactionService } from "../transactions/transactions.service.js";
import { ProductsService } from "../products/products.service.js";
import { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyInstance {
    userService: UsersService;
    transactionService: TransactionService;
    productsService: ProductsService;
    prisma: PrismaClient;
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}
