import axios from "axios";
import { TagDescription } from "../models/schemas";
import { RecordingRel } from "../models/relschemas";

import { WaveForm } from "../models/schemas";

export const RecordingService = {
  async get_info(id: number): Promise<RecordingRel> {
    console.log("LOAD RECORDING");
    return {
      id: 1,
      title: "Example recording",
      created_at: new Date("2024-07-05T09:19:40.814Z"),
      creator_id: 1,
      duration: 1,
      creator: {
        id: 1,
      },
      tags: [
        {
          id: 1,
          recording_id: 1,
          start: 0,
          end: 10,
          description: TagDescription.SILENT,
        },
      ],
      results: [
        {
          source_id: 1,
          id: 1,
          created_at: new Date("2024-07-05T09:19:40.814Z"),
          duration: 10,
        },
      ],
    };
  },
  async delete(id: number): Promise<void> {},
  async get_wave(id: number): Promise<WaveForm> {
    console.log("LOAD WAVE");
    return {};
  },
};
