import { RequestHandler } from "express";
import { ICreateUserDTO, IUserDTO } from "../dto/user";
import { IErrorDTO } from "../dto/error";
import { ICredentialDTO, ILoginDTO } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";

export interface IEmpty {}
export interface IUserHandler {
  registration: RequestHandler<IEmpty, IUserDTO | IErrorDTO, ICreateUserDTO>;
  login: RequestHandler<IEmpty, ICredentialDTO | IErrorDTO, ILoginDTO>;
  selfcheck: RequestHandler<IEmpty, IUserDTO | IErrorDTO, unknown, AuthStatus>;
}
