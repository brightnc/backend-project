import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { IUpdateContentDTO } from "../dto/content";
import { CONTENT_SELECT } from "../const";

export default class ContentRepository implements IContentRepository {
  private prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  createContent(content: ICreateContent, userId: string): Promise<IContent> {
    return this.prisma.content.create({
      data: {
        ...content,
        User: {
          connect: { id: userId },
        },
      },
      select: CONTENT_SELECT,
    });
  }

  getAllContent(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      select: CONTENT_SELECT,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  getContentById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      select: CONTENT_SELECT,
    });
  }

  updateContent(
    id: number,
    updateContent: IUpdateContentDTO
  ): Promise<IContent> {
    const now = new Date().toISOString();
    return this.prisma.content.update({
      where: { id },
      data: { ...updateContent, updatedAt: now },
      select: CONTENT_SELECT,
    });
  }

  deleteContent(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id },
      select: CONTENT_SELECT,
    });
  }
}
