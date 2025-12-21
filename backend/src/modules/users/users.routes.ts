import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { UsersController } from "./users.controller.js";

const userRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  if (!app.prisma || !app.userService) {
    throw new Error("Prisma or UserService not initialized");
  }
  const controller = new UsersController(app.prisma, app.userService);
  app.post(
    "/",
    {
      schema: {
        tags: ["Users"],
        summary: "Create a new user",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          201: {
            description: "User successfully created",
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.createUser,
  );

  app.post(
    "/login",
    {
      schema: {
        tags: ["Users"],
        summary: "User login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            description: "User successfully logged in",
            type: "object",
            properties: {
              accessToken: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    controller.loginUser,
  );

  app.get(
    "/:id",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Users"],
        summary: "Get user by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            description: "User details",
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.getUser,
  );

  app.get(
    "/",
    {
      preHandler: app.authenticate,
      schema: {
        tags: ["Users"],
        summary: "Get all users",
        response: {
          200: {
            description: "List of users",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                created_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    controller.getAllUsers,
  );
};

export default userRoutes;
