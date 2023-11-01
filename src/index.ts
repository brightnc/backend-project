import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const PORT = Number(process.env.PORT || 8800);

const client = new PrismaClient();

app.get("/", (req, res) => {
  return res.status(200).send("Hello world").end();
});

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
