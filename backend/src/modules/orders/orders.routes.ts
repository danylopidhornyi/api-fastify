import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { OrdersController } from "./orders.controller.js";

const ordersRoutes: FastifyPluginAsync = async (app: FastifyInstance) => {
  if (!app.prisma || !app.ordersService) {
    throw new Error("Prisma or OrdersService not initialized");
  }
  const controller = new OrdersController(app.prisma, app.ordersService);

  app.post(
    "/",
    {
      schema: {
        tags: ["Orders"],
        summary: "Create a new order",
        body: {
          type: "object",
          required: ["userId", "productIds"],
          properties: {
            userId: { type: "string" },
            productIds: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
        response: {
          201: {
            description: "Order successfully created",
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "string" },
              productIds: {
                type: "array",
                items: { type: "string" },
              },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.createOrder,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Orders"],
        summary: "Get order by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Order retrieved successfully",
            type: "object",
            properties: {
              id: { type: "string" },
              userId: { type: "string" },
              productIds: {
                type: "array",
                items: { type: "string" },
              },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.getOrderById,
  );

  app.get(
    "/user/:userId",
    {
      schema: {
        tags: ["Orders"],
        summary: "Get orders by User ID",
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            description: "List of orders for the user",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                userId: { type: "string" },
                productIds: {
                  type: "array",
                  items: { type: "string" },
                },
                createdAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    controller.getOrdersByUserId,
  );
};

export default ordersRoutes;
