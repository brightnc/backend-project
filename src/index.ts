import express from "express";
import { PrismaClient } from "@prisma/client";
import { IUserRepository } from "./repositories";
import UserRepository from "./repositories/user";
import { IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import validateUserBody from "./middleware/validateUserBody";

const app = express();
const PORT = Number(process.env.PORT || 8800);

const client = new PrismaClient();
const userRepo: IUserRepository = new UserRepository(client);
const userHandler: IUserHandler = new UserHandler(userRepo);

app.use(express.json());
const userRouter = express.Router();

app.get("/", (req, res) => {
  return res.status(200).send("Hello world").end();
});

app.use("/user", userRouter);

userRouter.post("/", validateUserBody(), userHandler.registration);

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
