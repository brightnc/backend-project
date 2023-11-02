import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { IContentHandler } from ".";
import { IContentDTO, toContentDTO } from "../dto/content";
import { IContentRepository, ICreateContent } from "../repositories";

export default class ContentHandler implements IContentHandler {
  private repo: IContentRepository;
  constructor(repo: IContentRepository) {
    this.repo = repo;
  }

  createContent: IContentHandler["createContent"] = async (req, res) => {
    try {
      const id = res.locals.user.id;
      const { videoUrl, comment, rating } = req.body;
      const createContentData: ICreateContent = {
        videoUrl,
        comment,
        rating,
        creatorName: "",
        creatorUrl: "",
        thumbnailUrl: "",
        videoTitle: "",
      };
      const result = await this.repo.createContent(createContentData, id);
      const contentResponse: IContentDTO = toContentDTO(result);
      return res.status(201).json(contentResponse).end();
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientValidationError) {
        return res.status(400).json({ message: "missing field" });
      }
      return res.status(500).json({ message: "internal server error" });
    }
  };
}
