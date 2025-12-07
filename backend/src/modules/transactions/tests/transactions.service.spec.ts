import { describe, it, expect, vi, beforeEach } from "vitest";
import TransactionService from "../transactions.service.js";
import AppError from "../../../core/errors/app-error.js";

const mockPrisma = {
  transaction: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

describe("TransactionService", () => {
  let service: TransactionService;

  beforeEach(() => {
    service = new TransactionService(mockPrisma as any);
    vi.clearAllMocks();
  });

  it("creates a transaction successfully", async () => {
    mockPrisma.transaction.create.mockResolvedValue({
      id: "2c84b73a-2b35-4101-9126-c22f08d63731",
      amount: 100,
    });

    const result = await service.create({
      user_id: "2c84b73a-2b35-4101-9126-c22f08d63732",
      product_id: "57ac8c93-5708-454e-9f44-d163fceff742",
      amount: 100,
      type: "credit",
    });
    expect(result).toEqual({
      id: "2c84b73a-2b35-4101-9126-c22f08d63731",
      amount: 100,
    });
    expect(mockPrisma.transaction.create).toHaveBeenCalled();
  });

  it("getById returns a transaction", async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue({
      id: "2c84b73a-2b35-4101-9126-c22f08d63732",
      amount: 100,
    });

    const transaction = await service.getById(
      "2c84b73a-2b35-4101-9126-c22f08d63732",
    );
    expect(transaction).toEqual({
      id: "2c84b73a-2b35-4101-9126-c22f08d63732",
      amount: 100,
    });
  });

  it("getById throws if transaction not found", async () => {
    mockPrisma.transaction.findUnique.mockResolvedValue(null);

    await expect(service.getById("999")).rejects.toThrow(AppError);
  });

  it("getAll returns transactions", async () => {
    mockPrisma.transaction.findMany.mockResolvedValue([
      { id: "2c84b73a-2b35-4101-9126-c22f08d63732 ", amount: 100 },
    ]);

    const transactions = await service.getAll();
    expect(transactions).toEqual([
      { id: "2c84b73a-2b35-4101-9126-c22f08d63732 ", amount: 100 },
    ]);
  });
});
