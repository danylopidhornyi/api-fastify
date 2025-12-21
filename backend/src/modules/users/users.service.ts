import { PrismaClient } from "@prisma/client";
import AppError from "../../core/errors/app-error.js";
import { hashPassword, verifyPassword } from "../../utils/password.util.js";

class UserService {
  constructor(private prisma: PrismaClient) {}
  async create(data: { email: string; password: string }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new AppError("Email already used", 400);

    data.password = await hashPassword(data.password);
    return await this.prisma.user.create({ data });
  }

  async login(data: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true, email: true, password: true },
    });
    if (!user) throw new AppError("Invalid credentials", 401);

    const isPasswordValid = await verifyPassword(user.password, data.password);
    if (!isPasswordValid) throw new AppError("Invalid credentials", 401);

    return { id: user.id, email: user.email };
  }

  async getById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    });
    if (!user) throw new AppError("User not found", 404);

    return user;
  }

  async getAll() {
    return await this.prisma.user.findMany();
  }
}

export default UserService;
