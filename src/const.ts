import { Prisma } from "@prisma/client";

const { JWT_SECRET: ENV_JWT_SECRET, REDIS_URL: ENV_REDIS_URL } = process.env;
if (!ENV_JWT_SECRET) {
  throw new Error("Environment variable : JWT_SECRET is not configured");
}
export const JWT_SECRET = ENV_JWT_SECRET;
export let REDIS_URL = ENV_REDIS_URL;
if (!ENV_REDIS_URL) {
  REDIS_URL = "redis://localhost:6379";
}

export const DEFAULT_USER_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  username: true,
  registeredAt: true,
};
export const CONTENT_SELECT: Prisma.ContentSelect = {
  id: true,
  comment: true,
  videoUrl: true,
  videoTitle: true,
  thumbnailUrl: true,
  creatorUrl: true,
  creatorName: true,
  rating: true,
  createdAt: true,
  updatedAt: true,
  User: {
    select: DEFAULT_USER_SELECT,
  },
};

export const BLACKLIST_REDIS_VALUE = "1";
