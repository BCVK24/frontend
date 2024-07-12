import axios from "axios";
import { UserRel } from "../models/relschemas";
import { GetAuthConfig } from "./params";
import { SERVER_URL } from "../env";

export const UserService = {
  async get_current(): Promise<UserRel | undefined> {
    console.log(`GET CURRENT USER`);
    const cfg = GetAuthConfig();
    let output = undefined;
    await axios
      .get(`${SERVER_URL}/user`, cfg)
      .then((response) => {
        output = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(output);
    return output;
  },
};
