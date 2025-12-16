import { PrismaClient } from "@prisma/client";
import AppError from "../../core/errors/app-error.js";

class ProductsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll() {
    return this.prisma.product.findMany();
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new AppError("Product not found", 404);

    return product;
  }

  async create(data: { name: string; description: string; price: number }) {
    return this.prisma.product.create({
      data,
    });
  }
}
export default ProductsService;
