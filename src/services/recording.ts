import axios from "axios";
import { GetAuthConfig } from "./params";
import { RecordingRel } from "../models/relschemas";
import { Recording } from "../models/schemas";
import { SERVER_URL } from "../env";

export const RecordingService = {
  async get_info(recording_id: number): Promise<RecordingRel | undefined> {
    console.log(`GET INFO for recording ${recording_id}`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .get(`${SERVER_URL}/recording/${recording_id}/`, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(output);
    return output;
  },
  async delete(recording_id: number): Promise<void> {
    console.log(`DELETE RECORDING ${recording_id}`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .delete(`${SERVER_URL}/recording/${recording_id}/`, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
  async create(recording_data, name: string): Promise<Recording | undefined> {
    console.log(`UPLOAD RECORDING`);

    const cfg = GetAuthConfig("multipart/form-data");

    const body = new FormData();
    body.append("recording_file", recording_data);
    body.append("recording", name);

    let output = undefined;
    await axios
      .post(`${SERVER_URL}/recording/`, body, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    return output;
  },
};
