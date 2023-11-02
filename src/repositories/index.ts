import { User } from "@prisma/client";
import { ICreateUserDTO, IUserDTO } from "../dto/user";
export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
export interface IUserRepository {
  createUser(user: ICreateUserDTO): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}
