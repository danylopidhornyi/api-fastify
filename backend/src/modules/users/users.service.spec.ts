import { describe, it, expect, vi, beforeEach } from "vitest";
import UserService from "./users.service.js";
import AppError from "../../core/errors/app-error.js";

const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    findMany: vi.fn(),
  },
};

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockPrisma as any);
    vi.clearAllMocks();
  });

  it("creates a user successfully", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({ id: "1", email: "a@b.com" });

    const result = await service.create({
      email: "a@b.com",
      password: "123456",
    });
    expect(result).toEqual({ id: "1", email: "a@b.com" });
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it("throws error if email exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "1", email: "a@b.com" });

    await expect(
      service.create({ email: "a@b.com", password: "123" }),
    ).rejects.toThrow(AppError);
  });

  it("getById returns a user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "1", email: "a@b.com" });

    const user = await service.getById("1");
    expect(user).toEqual({ id: "1", email: "a@b.com" });
  });

  it("getById throws if user not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(service.getById("999")).rejects.toThrow(AppError);
  });

  it("getAll returns users", async () => {
    mockPrisma.user.findMany.mockResolvedValue([{ id: "1", email: "a@b.com" }]);

    const users = await service.getAll();
    expect(users).toEqual([{ id: "1", email: "a@b.com" }]);
  });
});
