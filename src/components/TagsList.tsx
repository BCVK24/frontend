import { FC } from "react";
import { Group, Header } from "@vkontakte/vkui";
import WaveSurfer from "wavesurfer.js";
import RegionPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { Tag } from "../models/schemas";
import { RecordingRel } from "../models/relschemas";
import { TagCell } from ".";

interface TagsListProps {
  wavesurfer: WaveSurfer | null;
  wsRegionsRef: React.MutableRefObject<RegionPlugin | undefined>;
  currentRecordingRef: React.MutableRefObject<RecordingRel | undefined>;
}

export const TagsList: FC<TagsListProps> = ({
  wavesurfer,
  wsRegionsRef,
  currentRecordingRef,
}) => {
  return  (
    <Group header={
      <Header mode="secondary">
        {currentRecordingRef.current?.display_tags.length ? "Проблемные участки" : "Проблемных участков нет!"}
      </Header>
    }>
      {currentRecordingRef.current?.display_tags.map((tag: Tag, index: number) =>
        wsRegionsRef.current?.getRegions()[index] ? (
          <TagCell
            key={index}
            keyId={index}
            tag={tag}
            region={wsRegionsRef.current?.getRegions()[index]}
            wavesurfer={wavesurfer}
            currentRecordingRef={currentRecordingRef}
          />
        ) : undefined,
      )}
    </Group>
  );
};
