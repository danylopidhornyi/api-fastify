import { describe, it, beforeEach, expect, vi } from "vitest";
import { TransactionsController } from "../transactions.controller.js";

const mockTransaction = {
  id: "2504f6de-d6db-4197-98e0-339e9ed1d9f3",
  amount: 100,
};
const mockTransactions = [mockTransaction];

const mockTransactionsService = {
  create: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
  getByUserId: vi.fn(),
};

const mockPrisma = {} as any;

const createReq = (body = {}, params = {}) => ({ body, params }) as any;
const createReply = () => {
  const res: any = {};
  res.code = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

describe("TransactionsController", () => {
  let controller: TransactionsController;

  beforeEach(() => {
    controller = new TransactionsController(mockTransactionsService as any);
    vi.clearAllMocks();
  });

  it("createTransaction sends 201 with created transaction", async () => {
    mockTransactionsService.create.mockResolvedValueOnce(mockTransaction);
    const req = createReq({
      amount: 100,
      user_id: "57ac8c93-5708-454e-9f44-d163fceff742",
      product_id: "b1f5f6e1-3c4e-4d2e-9f7a-8f9e8c6d7c3a",
    });
    const reply = createReply();

    await controller.createTransaction(req, reply);

    expect(mockTransactionsService.create).toHaveBeenCalledWith({
      amount: 100,
      user_id: "57ac8c93-5708-454e-9f44-d163fceff742",
      product_id: "b1f5f6e1-3c4e-4d2e-9f7a-8f9e8c6d7c3a",
    });
    expect(reply.code).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith(mockTransaction);
  });
  it("getTransaction sends transaction by id", async () => {
    mockTransactionsService.getById.mockResolvedValueOnce(mockTransaction);
    const req = createReq({}, { id: "2504f6de-d6db-4197-98e0-339e9ed1d9f3" });
    const reply = createReply();

    await controller.getTransaction(req, reply);

    expect(mockTransactionsService.getById).toHaveBeenCalledWith(
      "2504f6de-d6db-4197-98e0-339e9ed1d9f3",
    );
    expect(reply.send).toHaveBeenCalledWith(mockTransaction);
  });

  it("getAllTransactions sends all transactions", async () => {
    mockTransactionsService.getAll.mockResolvedValueOnce(mockTransactions);
    const req = createReq();
    const reply = createReply();

    await controller.getAllTransactions(req, reply);

    expect(mockTransactionsService.getAll).toHaveBeenCalled();
    expect(reply.send).toHaveBeenCalledWith(mockTransactions);
  });

  it("getTransactionsByUserId sends transactions for a specific user", async () => {
    mockTransactionsService.getByUserId.mockResolvedValueOnce(mockTransactions);
    const req = createReq(
      {},
      { user_id: "57ac8c93-5708-454e-9f44-d163fceff742" },
    );
    const reply = createReply();

    await controller.getTransactionsByUserId(req, reply);

    expect(mockTransactionsService.getByUserId).toHaveBeenCalledWith(
      "57ac8c93-5708-454e-9f44-d163fceff742",
    );
    expect(reply.send).toHaveBeenCalledWith(mockTransactions);
  });
});
