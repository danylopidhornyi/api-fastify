// users.controller.ts
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

  createUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const user = await this.userService.create(req.body as any);
    reply.code(201).send(user);
  };

  getUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as any;
    const user = await this.userService.getById(id);
    reply.send(user);
  };

  getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
    const users = await this.userService.getAll();
    reply.send(users);
  };
}
