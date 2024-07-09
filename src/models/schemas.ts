export enum TagDescription {
  SILENT = "SILENT",
  CUSTOM = "CUSTOM",
}

export interface Result {
  source_id: number;
  id: number;
  created_at: Date;
  duration: number;
}

export interface Recording {
  id: number;
  title: string;
  created_at: Date;
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

export interface WaveForm {
  version: number;
  channels: number;
  sample_rate: number;
  samples_per_pixel: number;
  bits: number;
  length: number;
  data: Array<number>;
}
