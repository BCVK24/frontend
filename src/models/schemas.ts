export enum TagDescription {
  SILENT = "SILENT",
  CUSTOM = "CUSTOM",
}

export interface Result {
  source_id: number;
  id: number;
  url: string;
  created_at: string;
  duration: number;
}

export interface Recording {
  id: number;
  title: string;
  url: string;
  created_at: string;
  creator_id: number;
  duration: number;
}

export interface Tag {
  id: number;
  recording_id: number;
  start: number;
  end: number;
  description: TagDescription;
}

export interface User {
  id: number;
}
