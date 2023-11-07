import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IUserHandler } from ".";
import { IUserDTO, toUserDTO } from "../dto/user";
import { IUserRepository } from "../repositories";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../const";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  registration: IUserHandler["registration"] = async (req, res) => {
    const { name, username, password: plainPassword } = req.body;
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
      return res
        .status(400)
        .json({ message: "username is not a string" })
        .end();
    }
    if (username.length === 0) {
      return res
        .status(400)
        .json({ message: "username cannot be empty string" })
        .end();
    }

    if (typeof plainPassword !== "string") {
      return res
        .status(400)
        .json({ message: "password is not a string" })
        .end();
    }
    if (plainPassword.length === 0) {
      return res
        .status(400)
        .json({ message: "password cannot be empty string" })
        .end();
    }
    try {
      const result = await this.repo.createUser({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      const userResponse: IUserDTO = toUserDTO(result);

      return res.status(201).json(userResponse).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res
          .status(400)
          .json({ message: "username is already used" })
          .end();
      }

      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  login: IUserHandler["login"] = async (req, res) => {
    const { username, password: plainPassword } = req.body;
    try {
      const { id, password } = await this.repo.findByUsername(username);
      if (!verifyPassword(plainPassword, password)) {
        throw new Error("invalid username or password");
      }
      const accessToken = sign({ id }, JWT_SECRET, {
        algorithm: "HS512",
        expiresIn: "12h",
        issuer: "learnhub-api",
        subject: "user-credential",
      });

      return res.status(200).json({ accessToken: accessToken }).end();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res
          .status(400)
          .json({ message: "invalid username or password" })
          .end();
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message }).end();
      }
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  logout: IUserHandler["logout"] = async (req, res) => {
    try {
      const { token, expire } = res.locals.user;
      const expireBigInt = BigInt(expire);
      await this.repo.addInvalidToken({
        token,
        expire_epoch_timestamp: expireBigInt,
      });

      return res.status(200).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  getPersonalInfo: IUserHandler["getPersonalInfo"] = async (req, res) => {
    try {
      const id = res.locals.user.id;

      const result = await this.repo.findById(id);

      const userResponse: IUserDTO = toUserDTO(result);
      return res.status(201).json(userResponse).end();
    } catch (error) {
      console.error(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "user not found" }).end();
      }
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  getUserByUsername: IUserHandler["getUserByUsername"] = async (req, res) => {
    try {
      const result = await this.repo.findByUsername(req.params.username);
      const userResponse = toUserDTO(result);
      return res.status(200).json(userResponse).end();
    } catch (error) {
      console.error(error);
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        return res.status(404).json({ message: "user not found" }).end();
      }
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };
}
