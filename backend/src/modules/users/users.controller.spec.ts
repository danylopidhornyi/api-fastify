import { describe, it, beforeEach, expect, vi } from "vitest";
import { UsersController } from "./users.controller.js";

const mockUser = { id: "1", name: "Alice" };
const mockUsers = [mockUser];

const mockUserService = {
  create: vi.fn(),
  getById: vi.fn(),
  getAll: vi.fn(),
};

const mockPrisma = {} as any;

const createReq = (body = {}, params = {}) => ({ body, params }) as any;
const createReply = () => {
  const res: any = {};
  res.code = vi.fn(() => res);
  res.send = vi.fn(() => res);
  return res;
};

describe("UsersController", () => {
  let controller: UsersController;

  beforeEach(() => {
    controller = new UsersController(mockPrisma, mockUserService as any);
    vi.clearAllMocks();
  });

  it("createUser sends 201 with created user", async () => {
    mockUserService.create.mockResolvedValueOnce(mockUser);
    const req = createReq({ name: "Alice" });
    const reply = createReply();

    await controller.createUser(req, reply);

    expect(mockUserService.create).toHaveBeenCalledWith({ name: "Alice" });
    expect(reply.code).toHaveBeenCalledWith(201);
    expect(reply.send).toHaveBeenCalledWith(mockUser);
  });

  it("getUser sends user by id", async () => {
    mockUserService.getById.mockResolvedValueOnce(mockUser);
    const req = createReq({}, { id: "1" });
    const reply = createReply();

    await controller.getUser(req, reply);

    expect(mockUserService.getById).toHaveBeenCalledWith("1");
    expect(reply.send).toHaveBeenCalledWith(mockUser);
  });

  it("getAllUsers sends all users", async () => {
    mockUserService.getAll.mockResolvedValueOnce(mockUsers);
    const req = createReq();
    const reply = createReply();

    await controller.getAllUsers(req, reply);

    expect(mockUserService.getAll).toHaveBeenCalled();
    expect(reply.send).toHaveBeenCalledWith(mockUsers);
  });
});
