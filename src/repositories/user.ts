import { PrismaClient } from "@prisma/client";
import { IUserRepository } from ".";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
