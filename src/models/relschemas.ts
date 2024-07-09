import { Recording, User, Tag, Result } from "./schemas"

export interface RecordingRel extends Recording {
    creator: User
    tags: Array<Tag>
    results: Array<Result>
}

export interface ResultRel extends Result {
    source: Recording
}

export interface UserRel extends User {
    recordings: Array<Recording>
}