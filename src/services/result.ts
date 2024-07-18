import axios from "axios";
import { GetAuthConfig } from "../utils";
import { SERVER_URL } from "../env";
import { Result } from "../models/schemas";
import { ResultRel } from "../models/relschemas";

export const ResultService = {
  async create(recording_id: number): Promise<Result | undefined> {
    //console.log(`CREATE RESULT for recording ${recording_id}`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .post(`${SERVER_URL}/result/${recording_id}`, undefined, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
  async get(result_id: number): Promise<ResultRel | undefined> {
    //console.log(`DOWNLOAD RESULT ${result_id}`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .get(`${SERVER_URL}/result/${result_id}`, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
};
