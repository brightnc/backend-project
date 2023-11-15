import { RedisClientType } from "redis";
import { IBlacklistRepository, IToken } from ".";
import { BLACKLIST_REDIS_VALUE } from "../const";

export default class BlacklistRepository implements IBlacklistRepository {
  private redisClient: RedisClientType;
  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient;
  }

  async addToBlacklist(token: IToken): Promise<void> {
    const key = `bl_${token.token}`;
    await this.redisClient.SET(key, BLACKLIST_REDIS_VALUE);
    await this.redisClient.EXPIREAT(key, token.expire);
    return;
  }
  async isAlreadyBlacklisted(token: string): Promise<boolean> {
    const val = await this.redisClient.GET(`bl_${token}`);
    return val === BLACKLIST_REDIS_VALUE;
  }
}
