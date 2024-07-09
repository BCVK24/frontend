import axios from "axios";
import { UserRel } from "../models/relschemas";

export const UserService = {
  async get_current(): Promise<UserRel> {
    return {
      id: 1,
      recordings: [
        {
          id: 1,
          title: "Example recording",
          created_at: new Date("2024-07-05T09:16:53.098Z"),
          creator_id: 1,
          duration: 178,
        },
        {
          id: 2,
          title: "Example recording.1",
          created_at: new Date("2024-07-05T09:16:53.099Z"),
          creator_id: 1,
          duration: 178,
        },
      ],
    };
  },
};
