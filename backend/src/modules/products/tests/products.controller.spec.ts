import { describe, it, beforeEach, expect, vi } from "vitest";
import { ProductsController } from "../products.controller.js";

const mockProduct = {
  id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  name: "Test Product",
  description: "This is a test product",
  price: 99.99,
  created_at: new Date().toISOString(),
};
const mockProducts = [mockProduct];

const mockProductsService = {
  getById: vi.fn(),
  getAll: vi.fn(),
};

const createReq = (params = {}) => ({ params }) as any;
const createReply = () => {
  const res: any = {};
  res.code = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

describe("ProductsController", () => {
  let controller: ProductsController;

  beforeEach(() => {
    controller = new ProductsController(mockProductsService as any);
    vi.clearAllMocks();
  });

  it("getAllProducts sends list of products", async () => {
    mockProductsService.getAll.mockResolvedValueOnce(mockProducts);
    const req = createReq();
    const reply = createReply();

    await controller.getAllProducts(req, reply);

    expect(mockProductsService.getAll).toHaveBeenCalled();
    expect(reply.send).toHaveBeenCalledWith(mockProducts);
  });

  it("getProductById sends product by id", async () => {
    mockProductsService.getById.mockResolvedValueOnce(mockProduct);
    const req = createReq({ id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890" });
    const reply = createReply();

    await controller.getProductById(req, reply);

    expect(mockProductsService.getById).toHaveBeenCalledWith(
      "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    );
    expect(reply.send).toHaveBeenCalledWith(mockProduct);
  });

  it("getProductById sends 404 if product not found", async () => {
    mockProductsService.getById.mockResolvedValueOnce(null);
    const req = createReq({ id: "non-existent-id" });
    const reply = createReply();

    await controller.getProductById(req, reply);

    expect(mockProductsService.getById).toHaveBeenCalledWith("non-existent-id");
    expect(reply.code).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({ message: "Product not found" });
  });
});
