import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaClient } from "@prisma/client";
import UserService from "./users.service.js";

export class UsersController {
  private prisma: PrismaClient;
  private userService: UserService;

  constructor(prisma: PrismaClient, userService: UserService) {
    this.prisma = prisma;
    this.userService = userService;
  }

  loginUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await this.userService.login(
      req.body as { email: string; password: string },
    );

    const accessToken = req.server.jwt.sign({
      sub: user.id,
      email: user.email,
    });
    reply.send({
      accessToken,
      user,
    });
  };

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await this.userService.create(
      req.body as { email: string; password: string },
    );
    reply.code(201).send(user);
  };

  getUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const user = await this.userService.getById(id);
    reply.send(user);
  };

  getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await this.userService.getAll();
    reply.send(users);
  };
}
