import { describe, it, beforeAll, afterAll, expect, vi } from "vitest";
import Fastify from "fastify";
import { registerPlugins } from "./index.js";

const mockPrisma = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

vi.mock("../modules/users/users.service.js", () => {
  return {
    default: class {
      constructor() {
        return {};
      }
    },
  };
});

vi.mock("../../prisma/client/index.js", () => {
  return {
    PrismaClient: class {
      constructor() {
        return mockPrisma;
      }
    },
  };
});

describe("registerPlugins", () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify();
    await registerPlugins(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it("attaches prisma and userService to Fastify instance", () => {
    expect(app.prisma).toBe(mockPrisma);
    expect(app.userService).toBeDefined();
  });

  it("attaches productsService to Fastify instance", () => {
    expect(app.productsService).toBeDefined();
  });

  it("attaches transactionService to Fastify instance", () => {
    expect(app.transactionService).toBeDefined();
  });

  it("swagger route is available", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/documentation/json",
    });
    expect(response.statusCode).toBe(200);
  });

  it("onClose disconnects Prisma", async () => {
    await app.close();
    expect(mockPrisma.$disconnect).toHaveBeenCalled();
  });
});
