import { RequestHandler } from "express";
import { JsonWebTokenError, JwtPayload, verify } from "jsonwebtoken";
import { JWT_SECRET } from "../const";
import { IBlacklistRepository, IUserRepository } from "../repositories";

export interface AuthStatus {
  user: {
    id: string;
    token: string;
    expire: number;
  };
}

export default class JWTMiddleware {
  private blacklistRepo: IBlacklistRepository;
  constructor(blacklistRepo: IBlacklistRepository) {
    this.blacklistRepo = blacklistRepo;
  }

  auth: RequestHandler<unknown, unknown, unknown, unknown, AuthStatus> = async (
    req,
    res,
    next
  ) => {
    try {
      const token = req.header("Authorization")!.replace("Bearer ", "").trim();
      const invalidToken = await this.blacklistRepo.isAlreadyBlacklisted(token);

      if (invalidToken) {
        throw new Error("token is blacklisted");
      }

      const { id, exp } = verify(token, JWT_SECRET) as JwtPayload;
      if (!exp) {
        return res.status(401).send("token expired").end();
      }
      res.locals = {
        user: {
          id,
          token,
          expire: exp,
        },
      };

      return next();
    } catch (error) {
      console.error(error);

      if (error instanceof TypeError) {
        return res.status(401).send("Authorization is expected").end();
      }
      if (error instanceof JsonWebTokenError) {
        return res.status(401).send("Forbidden: token is invalid").end();
      }
      if (error instanceof Error) {
        return res.status(401).send("Forbidden: token is invalid").end();
      }

      return res.status(500).send("internal server error");
    }
  };
}
