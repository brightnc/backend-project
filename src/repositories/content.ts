import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";
import { IUpdateContentDTO } from "../dto/content";

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
      select: {
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
          select: {
            id: true,
            name: true,
            username: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  getAllContent(): Promise<IContent[]> {
    return this.prisma.content.findMany({
      select: {
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
          select: {
            id: true,
            name: true,
            username: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  getContentById(id: number): Promise<IContent> {
    return this.prisma.content.findUniqueOrThrow({
      where: { id },
      select: {
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
          select: {
            id: true,
            name: true,
            username: true,
            registeredAt: true,
          },
        },
      },
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
      select: {
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
          select: {
            id: true,
            name: true,
            username: true,
            registeredAt: true,
          },
        },
      },
    });
  }

  deleteContent(id: number): Promise<IContent> {
    return this.prisma.content.delete({
      where: { id },
      select: {
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
          select: {
            id: true,
            name: true,
            username: true,
            registeredAt: true,
          },
        },
      },
    });
  }
}
