import { Recording, User, Tag, Result } from "./schemas";

export interface RecordingRel extends Recording {
  creator: User;
  display_tags: Tag[];
  results: Result[];
  url: string;
  //soundwave: string;
}

export interface ResultRel extends Result {
  source: Recording;
}

export interface UserRel extends User {
  recordings: Recording[];
}

export interface TagRel extends Tag {
  recording: Recording;
}
