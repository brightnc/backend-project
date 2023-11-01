import { PrismaClient } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDTO, IUserDTO } from "../dto/user";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  createUser(user: ICreateUserDTO): Promise<IUser> {
    return this.prisma.user.create({
      data: user,
      select: {
        id: true,
        name: true,
        username: true,
        registeredAt: true,
      },
    });
  }
}
