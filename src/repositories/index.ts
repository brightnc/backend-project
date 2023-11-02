import { User } from "@prisma/client";
import { ICreateUserDTO } from "../dto/user";
import { IUpdateContentDTO } from "../dto/content";
export interface IUser {
  id: string;
  username: string;
  name: string;
  registeredAt: Date;
}
export interface IContent {
  id: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  rating: number;
  thumbnailUrl: string;
  creatorName: string;
  creatorUrl: string;
  createdAt: Date;
  updatedAt: Date;
  User: IUser;
  ownerId: string;
}

export interface ICreateContent {
  rating: number;
  videoTitle: string;
  videoUrl: string;
  comment: string;
  creatorName: string;
  creatorUrl: string;
  thumbnailUrl: string;
}
export interface IUserRepository {
  createUser(user: ICreateUserDTO): Promise<IUser>;
  findByUsername(username: string): Promise<User>;
  findById(id: string): Promise<IUser>;
}

export interface IContentRepository {
  createContent(content: ICreateContent, ownerId: string): Promise<IContent>;
  getAllContent(): Promise<IContent[]>;
  getContentById(id: number): Promise<IContent>;
  updateContent(
    id: number,
    updateContent: IUpdateContentDTO
  ): Promise<IContent>;
  deleteContent(id: number): Promise<IContent>;
}
