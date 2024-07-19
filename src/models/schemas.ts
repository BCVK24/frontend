export interface Result {
  source_id: number;
  id: number;
  url: string;
  created_at: string;
  duration: number;
  processing: boolean;
}

export interface Recording {
  id: number;
  title: string;
  created_at: string;
  creator_id: number;
  duration: number;
  processing: boolean;
}

export interface Tag {
  id: number;
  recording_id: number;
  start: number;
  end: number;
  description: string;
  tag_type: "MODELTAG" | "USERTAG" | "SOURCETAG";
}

export interface User {
  id: number;
}
