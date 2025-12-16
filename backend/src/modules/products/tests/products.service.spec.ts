import { describe, it, expect, vi, beforeEach } from "vitest";
import ProductService from "../products.service.js";
import AppError from "../../../core/errors/app-error.js";

const mockPrisma = {
  product: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

describe("ProductService", () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService(mockPrisma as any);
    vi.clearAllMocks();
  });

  it("creates a product successfully", async () => {
    mockPrisma.product.create.mockResolvedValue({
      id: "2c84b73a-2b35-4101-9126-c22f08d63731",
      name: "Test Product",
      description: "A product for testing",
      price: 99.99,
    });

    const result = await service.create({
      name: "Test Product",
      description: "A product for testing",
      price: 99.99,
    });
    expect(result).toEqual({
      id: "2c84b73a-2b35-4101-9126-c22f08d63731",
      name: "Test Product",
      description: "A product for testing",
      price: 99.99,
    });
    expect(mockPrisma.product.create).toHaveBeenCalled();
  });

  it("getById returns a product", async () => {
    mockPrisma.product.findUnique.mockResolvedValue({
      id: "2c84b73a-2b35-4101-9126-c22f08d63732",
      name: "Another Product",
      description: "Another product for testing",
      price: 49.99,
    });

    const product = await service.getById(
      "2c84b73a-2b35-4101-9126-c22f08d63732",
    );
    expect(product).toEqual({
      id: "2c84b73a-2b35-4101-9126-c22f08d63732",
      name: "Another Product",
      description: "Another product for testing",
      price: 49.99,
    });
  });

  it("getById throws if product not found", async () => {
    mockPrisma.product.findUnique.mockResolvedValue(null);

    await expect(service.getById("c22f08d63731")).rejects.toThrow(AppError);
  });

  it("getAll returns products", async () => {
    mockPrisma.product.findMany.mockResolvedValue([
      {
        id: "2c84b73a-2b35-4101-9126-c22f08d63732 ",
        name: "Product 1",
        description: "First product",
        price: 29.99,
      },
      {
        id: "3d95b84b-3c46-5212-a237-d33g19e74843 ",
        name: "Product 2",
        description: "Second product",
        price: 59.99,
      },
    ]);

    const products = await service.getAll();
    expect(products).toEqual([
      {
        id: "2c84b73a-2b35-4101-9126-c22f08d63732 ",
        name: "Product 1",
        description: "First product",
        price: 29.99,
      },
      {
        id: "3d95b84b-3c46-5212-a237-d33g19e74843 ",
        name: "Product 2",
        description: "Second product",
        price: 59.99,
      },
    ]);
  });
});
