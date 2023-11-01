import { Request, Response, NextFunction } from "express";
import { IErrorDTO } from "../dto/error";
import { ICreateUserDTO } from "../dto/user";

const validateUserBody =
  () =>
  (
    req: Request<{}, IErrorDTO, ICreateUserDTO>,
    res: Response,
    next: NextFunction
  ) => {
    console.log("validate middleware");

    const { name, username, password } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "name is not a string" }).end();
    }
    if (name.length === 0) {
      return res
        .status(400)
        .json({ message: "name cannot be empty string" })
        .end();
    }

    if (typeof username !== "string") {
      return res.status(400).json({ error: "username is not a string" }).end();
    }
    if (username.length === 0) {
      return res
        .status(400)
        .json({ message: "username cannot be empty string" })
        .end();
    }

    if (typeof password !== "string") {
      return res.status(400).json({ error: "password is not a string" }).end();
    }
    if (password.length === 0) {
      return res
        .status(400)
        .json({ message: "password cannot be empty string" })
        .end();
    }

    return next();
  };

export default validateUserBody;
