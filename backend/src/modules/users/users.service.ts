import { PrismaClient } from "@prisma/client";
import AppError from "../../core/errors/app-error.js";

class UserService {
  constructor(
    private prisma: PrismaClient
  ){}
  async create(data: { email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError("Email already used", 400);

    return await this.prisma.user.create({ data });
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("User not found", 404);

    return user;
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }
}

export default UserService