import { PrismaClient, User } from "@prisma/client";
import { IUser, IUserRepository } from ".";
import { ICreateUserDTO } from "../dto/user";
import { SAFE_USER_SELECT } from "../const";

export default class UserRepository implements IUserRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  createUser(user: ICreateUserDTO): Promise<IUser> {
    return this.prisma.user.create({
      data: user,
      select: SAFE_USER_SELECT,
    });
  }

  findByUsername(username: string): Promise<User> {
    return this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
  }

  findById(id: string): Promise<IUser> {
    return this.prisma.user.findUniqueOrThrow({
      select: SAFE_USER_SELECT,
      where: { id },
    });
  }
}
