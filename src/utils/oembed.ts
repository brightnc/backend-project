import axios from "axios";
import { OEmbedData, OEmbedResponseDto } from "../dto/oembed";

export const oEmbed = async (youtubeUrl: string): Promise<OEmbedData> => {
  const result = await axios.get<OEmbedResponseDto>(
    `https://noembed.com/embed?url=${youtubeUrl}`
  );

  const { title, thumbnail_url, author_name, author_url, error } = result.data;

  if (error) {
    throw new Error("invalid youtube url");
  }

  return { title, thumbnail_url, author_name, author_url };
};
