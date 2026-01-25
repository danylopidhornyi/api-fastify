import Fastify from "fastify";
import { vi, describe, it, expect, beforeAll, afterAll } from "vitest";

const mockCreateProduct = vi.fn(async (req, reply) => reply.code(201).send({}));

const mockGetProductById = vi.fn(async (req, reply) => reply.send({}));

const mockGetAllProducts = vi.fn(async (req, reply) => reply.send([]));

vi.mock("../products.controller.js", () => {
  return {
    ProductsController: class {
      createProduct = mockCreateProduct;
      getProductById = mockGetProductById;
      getAllProducts = mockGetAllProducts;
    },
  };
});

import productRoutes from "../products.routes.js";

describe("productRoutes", () => {
  let app: Fastify.FastifyInstance;

  beforeAll(async () => {
    app = Fastify();
    app.decorate("prisma", {});
    app.decorate("productsService", {});
    await app.register(productRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  it("POST /products calls createProduct", async () => {
    await app.inject({
      method: "POST",
      url: "/",
      payload: {
        name: "Sample Product",
        description: "This is a sample product.",
        price: 29.99,
      },
    });
    expect(mockCreateProduct).toHaveBeenCalled();
  });

  it("GET /products calls getAllProducts", async () => {
    await app.inject({ method: "GET", url: "/" });
    expect(mockGetAllProducts).toHaveBeenCalled();
  });

  it("GET /products/:id calls getProductById", async () => {
    const sampleId = "123e4567-e89b-12d3-a456-426614174000";
    await app.inject({ method: "GET", url: `/${sampleId}` });
    expect(mockGetProductById).toHaveBeenCalled();
  });
});
