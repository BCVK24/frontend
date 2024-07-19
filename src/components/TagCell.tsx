import { FC } from "react";
import { IconButton, SimpleCell } from "@vkontakte/vkui";
import { Icon24Delete, Icon24RobotOutline, Icon24User } from "@vkontakte/icons";
import { Tag } from "../models/schemas";
import { TagToNormalized } from "../utils/secondsConvert";
import { TagService } from "../services/tag";
import { RecordingRel } from "../models/relschemas";
import WaveSurfer from "wavesurfer.js";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";

interface TagCellProps {
  keyId: number;
  tag: Tag;
  wavesurfer: WaveSurfer | null;
  recording: RecordingRel;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  //wsRegions: RegionsPlugin | undefined;
  //wsRegionsRef: React.MutableRefObject<RegionsPlugin | undefined>;
  region: Region;
}

/**
 * @description Used for quck navigation on player
 */
export const TagCell: FC<TagCellProps> = ({
  keyId,
  tag,
  wavesurfer,
  recording,
  setRecording,
  //wsRegionsRef,
  //wsRegions,
  region,
}) => {
  const navigateTo = (where: number) => {
    wavesurfer && wavesurfer.setTime(where);
  };

  const deleteTag = async (key: number) => {
    await TagService.delete(tag.id);

    const new_tags = recording.tags;
    new_tags.splice(key, 1);

    //console.log("IN TAGCELL", region);
    setRecording({ ...recording, tags: new_tags });
    region && region.remove();
  };

  let icon;
  switch (tag.tag_type) {
    case "MODELTAG":
      icon = <Icon24RobotOutline />;
      break;
    default:
      icon = <Icon24User />;
      break;
  }

  return (
    <SimpleCell
      expandable="auto"
      before={icon}
      after={
        <IconButton onClick={() => deleteTag(keyId)}>
          <Icon24Delete color={"#E64646"} />
        </IconButton>
      }
      onClick={() => navigateTo(region.start)}
    >
      {TagToNormalized(region.start, region.end)}
    </SimpleCell>
  );
};
