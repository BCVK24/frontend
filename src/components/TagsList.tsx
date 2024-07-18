import { FC } from "react";
import { Tag } from "../models/schemas";
import { RecordingRel } from "../models/relschemas";
import { Group, Div, Header } from "@vkontakte/vkui";
import { TagCell } from "./TagCell";
import WaveSurfer from "wavesurfer.js";

import RegionPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.js";

interface TagsListProps {
  recording: RecordingRel;
  wavesurfer: WaveSurfer | null;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  wsRegionsRef: React.MutableRefObject<RegionPlugin | undefined>;
}

export const TagsList: FC<TagsListProps> = ({
  recording,
  wavesurfer,
  setRecording,
  wsRegionsRef,
}) => {
  //console.log("IN TAGSLIST", wsRegionsRef.current?.getRegions());
  return recording.tags.length ? (
    <Group header={<Header mode="secondary">Проблемные участки</Header>}>
      {recording.tags.map((tag: Tag, index: number) =>
        wsRegionsRef.current?.getRegions()[index] ? (
          <TagCell
            tag={tag}
            region={wsRegionsRef.current?.getRegions()[index]}
            wavesurfer={wavesurfer}
            key={index}
            keyId={index}
            recording={recording}
            setRecording={setRecording}
          />
        ) : undefined,
      )}
    </Group>
  ) : (
    <Div>В этой записи нет проблемных участков</Div>
  );
};
