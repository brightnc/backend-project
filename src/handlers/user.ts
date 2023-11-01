import { IUserHandler } from ".";
import { IUserRepository } from "../repositories";

export default class UserHandler implements IUserHandler {
  private repo: IUserRepository;
  constructor(repo: IUserRepository) {
    this.repo = repo;
  }
}
