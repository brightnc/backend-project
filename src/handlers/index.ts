import { RequestHandler } from "express";
import { ICreateUserDTO, IUserDTO } from "../dto/user";
import { IErrorDTO } from "../dto/error";

export interface IEmpty {}
export interface IUserHandler {
  registration: RequestHandler<IEmpty, IUserDTO | IErrorDTO, ICreateUserDTO>;
}
