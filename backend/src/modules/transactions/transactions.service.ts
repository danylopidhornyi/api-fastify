import { PrismaClient } from "@prisma/client";
import AppError from "../../core/errors/app-error.js";

class TransactionService {
  constructor(private prisma: PrismaClient) {}

  create(data: {
    userId: string;
    productId: string;
    amount: number;
    type: "credit" | "debit";
  }) {
    return this.prisma.transaction.create({ data });
  }

  async getById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });
    if (!transaction) throw new AppError("Transaction not found", 404);

    return transaction;
  }

  async getByUserId(userId: string) {
    return await this.prisma.transaction.findMany({ where: { userId } });
  }

  async getAll() {
    return await this.prisma.transaction.findMany();
  }
}

export default TransactionService;
