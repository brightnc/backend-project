import { RequestHandler } from "express";
import { ICreateUserDTO, IUserDTO } from "../dto/user";
import { IErrorDTO } from "../dto/error";
import { ICredentialDTO, ILoginDTO } from "../dto/auth";
import { AuthStatus } from "../middleware/jwt";
import { IContentDTO, ICreateContentDTO } from "../dto/content";

export interface IEmpty {}
export interface IUserHandler {
  registration: RequestHandler<IEmpty, IUserDTO | IErrorDTO, ICreateUserDTO>;
  login: RequestHandler<IEmpty, ICredentialDTO | IErrorDTO, ILoginDTO>;
  selfcheck: RequestHandler<
    IEmpty,
    IUserDTO | IErrorDTO,
    unknown,
    unknown,
    AuthStatus
  >;
}

export interface IContentHandler {
  createContent: RequestHandler<
    IEmpty,
    IContentDTO | IErrorDTO,
    ICreateContentDTO,
    unknown,
    AuthStatus
  >;
}
