import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import {
  IBlacklistRepository,
  IContentRepository,
  IUserRepository,
} from "./repositories";
import UserRepository from "./repositories/user";
import { IContentHandler, IUserHandler } from "./handlers";
import UserHandler from "./handlers/user";
import JWTMiddleware from "./middleware/jwt";
import ContentRepository from "./repositories/content";
import ContentHandler from "./handlers/content";
import { RedisClientType, createClient } from "redis";
import BlacklistRepository from "./repositories/blacklist";

const app = express();
const PORT = Number(process.env.PORT || 8800);

const client = new PrismaClient();
const redisClient: RedisClientType = createClient();
redisClient.on("ready", function () {
  console.log("Connected to Redis server successfully");
});

//Blacklist
const blacklistRepo: IBlacklistRepository = new BlacklistRepository(
  redisClient
);
// User
const userRepo: IUserRepository = new UserRepository(client);
const userHandler: IUserHandler = new UserHandler(userRepo, blacklistRepo);
// Content
const contentRepo: IContentRepository = new ContentRepository(client);
const contentHandler: IContentHandler = new ContentHandler(contentRepo);

const jwtMiddleware = new JWTMiddleware(blacklistRepo);

app.use(cors());
app.use(express.json());
const userRouter = express.Router();
const authRouter = express.Router();
const contentRouter = express.Router();

app.get("/", (req, res) => {
  return res.status(200).send("Hello world").end();
});

app.use("/user", userRouter);
userRouter.get("/:username", userHandler.getUserByUsername);
userRouter.post("/", userHandler.registration);

app.use("/auth", authRouter);
authRouter.post("/login", userHandler.login);
authRouter.post("/logout", jwtMiddleware.auth, userHandler.logout);
authRouter.get("/me", jwtMiddleware.auth, userHandler.getPersonalInfo);

app.use("/content", contentRouter);
contentRouter.post("/", jwtMiddleware.auth, contentHandler.createContent);
contentRouter.get("/", contentHandler.getAllContent);
contentRouter.get("/:id", contentHandler.getContentById);
contentRouter.patch("/:id", jwtMiddleware.auth, contentHandler.updateContent);
contentRouter.delete("/:id", jwtMiddleware.auth, contentHandler.deleteContent);

const server = app.listen(PORT, () => {
  redisClient.connect();
  console.log(`server is listening on port ${PORT}`);
});

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
function shutDown() {
  console.log("Received kill signal, shutting down gracefully");
  server.close(async () => {
    console.log("Closed out remaining connections");
    await redisClient.quit();
    console.log("Redis client stopped");

    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
}
