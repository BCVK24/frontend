import { Tag, TagDescription } from "../models/schemas";

export const TagService = {
  async create(
    from: number,
    to: number,
    recording_id: number,
    description: TagDescription = TagDescription.CUSTOM,
  ): Promise<Tag> {
    console.log(`CREATE TAG for ${recording_id}`);
  },
  async update(recording) {},
};
