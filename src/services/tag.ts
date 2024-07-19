import { Tag } from "../models/schemas";
import { GetAuthConfig } from "../utils";
import { SERVER_URL } from "../env";
import axios from "axios";

export const TagService = {
  async create(
    start: number,
    end: number,
    recording_id: number,
    description: string = "Добавлено пользователем",
  ): Promise<Tag | undefined> {
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .post(
        `${SERVER_URL}/tag/`,
        {
          recording_id: recording_id,
          start: start,
          end: end,
          description: description,
        },
        cfg,
      )
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
  async update(tag: Tag): Promise<void> {
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .put(
        `${SERVER_URL}/tag/`,
        {
          id: tag.id,
          start: tag.start,
          end: tag.end,
          description: tag.description
        },
        cfg,
      )
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
  async delete(tag_id: number): Promise<void> {
    const cfg = GetAuthConfig();
    await axios.delete(`${SERVER_URL}/tag/${tag_id}`, cfg).catch((error) => {
      console.log(error);
    });
  },
};
