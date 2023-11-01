export interface IUserDTO {
  id: string;
  username: string;
  name: string;
  registeredAt: string;
}

export interface ICreateUserDTO {
  name: string;
  username: string;
  password: string;
}
