import { PrismaClient } from "@prisma/client";

class OrdersService {
  constructor(private prisma: PrismaClient) {}

  async createOrder(data: { userId: string; productIds: string[] }) {}

  async getOrderById(id: string) {}

  async getOrdersByUserId(userId: string) {}
}

export default OrdersService;
