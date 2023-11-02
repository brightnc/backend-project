import { PrismaClient } from "@prisma/client";
import { IContent, IContentRepository, ICreateContent } from ".";

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
      include: {
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
