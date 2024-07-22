import { Tag } from "../models/schemas"

export const getTag = (tagId: number, tags: Tag[] | undefined): Tag | undefined => {
  if (!tags)
    return undefined;

  for (const tag of tags) {
    if (tag.id == tagId)
      return tag;
  }
  return undefined;
}

export const upTag = (tag: Tag, tags: Tag[]) => {
  for (const [id, _tag] of tags.entries()) {
    if (_tag.id == tag.id) {
      tags[id] = tag;
    }
  }

  return tags
}