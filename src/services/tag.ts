import { Tag } from "../models/schemas";
import { GetAuthConfig } from "../utils";
import { SERVER_URL } from "../env";
import axios from "axios";

export const TagService = {
  async create(
    start: number,
    end: number,
    recording_id: number,
    description: string = "CUSTOM",
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
  async update(id: number, start: number, end: number): Promise<void> {
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .put(
        `${SERVER_URL}/tag/`,
        {
          id: id,
          start: start,
          end: end,
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
  async delete(id: number): Promise<void> {
    const cfg = GetAuthConfig();
    await axios.delete(`${SERVER_URL}/tag/${id}`, cfg).catch((error) => {
      console.log(error);
    });
  },
};
