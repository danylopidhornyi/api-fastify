import { PrismaClient } from "@prisma/client";
import OrdersService from "./orders.service.js";
import { FastifyRequest } from "fastify/types/request.js";
import { FastifyReply } from "fastify/types/reply.js";

export class OrdersController {
  private prisma: PrismaClient;
  private ordersService: OrdersService;

  constructor(prisma: PrismaClient, ordersService: OrdersService) {
    this.prisma = prisma;
    this.ordersService = ordersService;
  }
  async createOrder(req: FastifyRequest, reply: FastifyReply) {
    const { userId, productIds } = req.body as {
      userId: string;
      productIds: string[];
    };
    const order = await this.ordersService.createOrder({ userId, productIds });
    reply.code(201).send(order);
  }

  async getOrderById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as { id: string };
    const order = await this.ordersService.getOrderById(id);
    reply.send(order);
  }

  async getOrdersByUserId(req: FastifyRequest, reply: FastifyReply) {
    const { userId } = req.params as { userId: string };
    const orders = await this.ordersService.getOrdersByUserId(userId);
    reply.send(orders);
  }
}
