import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IUserHandler } from ".";
import { IUserDTO } from "../dto/user";
import { IUserRepository } from "../repositories";
import { hashPassword } from "../utils/bcrypt";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }

  registration: IUserHandler["registration"] = async (req, res) => {
    const { name, username, password } = req.body;
    try {
      const result = await this.repo.createUser({
        name,
        username,
        password: hashPassword(password),
      });

      const userResponse: IUserDTO = {
        ...result,
        registeredAt: result.registeredAt.toUTCString(),
      };

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

      return res.status(500).json({ message: "internal server error" });
    }
  };
}
