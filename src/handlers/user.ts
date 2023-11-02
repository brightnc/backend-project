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
    try {
      const result = await this.repo.createUser({
        name,
        username,
        password: hashPassword(plainPassword),
      });

      const userResponse: IUserDTO = toUserDTO(result);

      return res.status(201).json(userResponse).end();
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return res
            .status(400)
            .json({ message: "username is already used" })
            .end();
        }
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res
            .status(400)
            .json({ message: "invalid username or password" })
            .end();
        }
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message }).end();
      }
      return res.status(500).json({ message: "internal server error" }).end();
    }
  };

  selfcheck: IUserHandler["selfcheck"] = async (req, res) => {
    try {
      const id = res.locals.user.id;

      const result = await this.repo.findById(id);

      const userResponse: IUserDTO = toUserDTO(result);
      return res.status(201).json(userResponse).end();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "internal server error" });
    }
  };
}
