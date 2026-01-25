import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { ProductsController } from "./products.controller.js";

export const productRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
) => {
  if (!app.prisma || !app.productsService) {
    throw new Error("Prisma or ProductsService not initialized");
  }
  const controller = new ProductsController(app.productsService);

  app.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        summary: "Get all products",
        response: {
          200: {
            description: "List of products",
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                created_at: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
    },
    controller.getAllProducts,
  );

  app.get(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        summary: "Get product by ID",
        params: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Product details",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              created_at: { type: "string", format: "date-time" },
            },
          },
          404: {
            description: "Product not found",
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    controller.getProductById,
  );

  app.post(
    "/",
    {
      schema: {
        tags: ["Products"],
        summary: "Create a new product",
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
          },
          required: ["name", "description", "price"],
        },
        response: {
          201: {
            description: "Product created successfully",
            type: "object",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              created_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    controller.createProduct,
  );
};

export default productRoutes;
