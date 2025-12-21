import { describe, it, expect, vi, beforeEach } from "vitest";
import * as passwordUtil from "../../../utils/password.util.js";
import UserService from "../users.service.js";
import AppError from "../../../core/errors/app-error.js";

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

  it("hashes password before saving", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const hashSpy = vi
      .spyOn(passwordUtil, "hashPassword")
      .mockResolvedValue("hashed-abc");
    mockPrisma.user.create.mockResolvedValue({
      id: "1",
      email: "a@b.com",
      password: "hashed-abc",
    });

    const result = await service.create({
      email: "a@b.com",
      password: "123456",
    });

    expect(hashSpy).toHaveBeenCalledWith("123456");
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { email: "a@b.com", password: "hashed-abc" },
    });
    expect(result).toEqual({
      id: "1",
      email: "a@b.com",
      password: "hashed-abc",
    });
  });

  it("logs in successfully with valid credentials", async () => {
    const userRecord = { id: "1", email: "a@b.com", password: "hashed-abc" };
    mockPrisma.user.findUnique.mockResolvedValue(userRecord);
    const verifySpy = vi
      .spyOn(passwordUtil, "verifyPassword")
      .mockResolvedValue(true);

    const result = await service.login({
      email: "a@b.com",
      password: "123456",
    });

    expect(verifySpy).toHaveBeenCalledWith("hashed-abc", "123456");
    expect(result).toEqual({ id: "1", email: "a@b.com" });
  });

  it("returns id, email, JWT on login", async () => {
    const userRecord = { id: "2", email: "b@c.com" };
    mockPrisma.user.findUnique.mockResolvedValue(userRecord);
    vi.spyOn(passwordUtil, "verifyPassword").mockResolvedValue(true);

    const result = await service.login({ email: "b@c.com", password: "pw" });

    expect(result).toEqual(userRecord);
    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("email");
  });

  it("throws when user not found on login", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({ email: "no@one.com", password: "123456" }),
    ).rejects.toThrow(AppError);
  });

  it("throws when password is invalid", async () => {
    const userRecord = { id: "1", email: "a@b.com", password: "hashed-abc" };
    mockPrisma.user.findUnique.mockResolvedValue(userRecord);
    vi.spyOn(passwordUtil, "verifyPassword").mockResolvedValue(false);

    await expect(
      service.login({ email: "a@b.com", password: "wrongpass" }),
    ).rejects.toThrow(AppError);
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
