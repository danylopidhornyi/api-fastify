import { describe, it, beforeAll, expect, vi } from "vitest";
import Fastify from "fastify";

const mockPrisma = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

vi.mock("../modules/users/users.service.js", () => {
  return {
    default: class {},
  };
});

vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn().mockImplementation(function () {
      return mockPrisma;
    }),
  };
});

import { registerPlugins } from "./index.js";

describe("registerPlugins", () => {
  let app: any;

  beforeAll(async () => {
    app = Fastify();
    await registerPlugins(app);
  });

  it("attaches prisma and modules", () => {
    expect(app.prisma).toBe(mockPrisma);
    expect(app.usersModule).toBeDefined();
    expect(app.productsModule).toBeDefined();
    expect(app.transactionsModule).toBeDefined();
  });

  it("swagger route is available", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/documentation/json",
    });
    expect(response.statusCode).toBe(200);
  });

  it("onClose disconnects Prisma", async () => {
    const app = Fastify();
    await registerPlugins(app);

    await app.close();

    expect(mockPrisma.$disconnect).toHaveBeenCalled();
  });
});
