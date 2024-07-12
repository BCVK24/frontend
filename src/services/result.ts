import axios from "axios";
import { Recording } from "../models/schemas";
import { GetAuthConfig } from "./params";
import { SERVER_URL } from "../env";

export const ResultService = {
  async create(recording_id: number): Promise<Recording | undefined> {
    console.log(`CREATE RESULT for recording ${recording_id}`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .post(`${SERVER_URL}/result/${recording_id}/`, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
  async download(result_id: number): Promise<void> {
    console.log(`DOWNLOAD RESULT ${result_id}`);
  },
};
