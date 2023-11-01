import { ICreateUserDTO, IUserDTO } from "../dto/user";
export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
export interface IUserRepository {
  createUser(user: ICreateUserDTO): Promise<IUser>;
}
