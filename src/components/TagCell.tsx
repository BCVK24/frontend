import { FC } from "react";
import { IconButton, SimpleCell } from "@vkontakte/vkui";
import { Icon24Delete, Icon24RobotOutline, Icon24User } from "@vkontakte/icons";
import WaveSurfer from "wavesurfer.js";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { TagToNormalized } from "../utils";
import { TagService } from "../services";
import { RecordingRel } from "../models/relschemas";
import { Tag } from "../models/schemas";

interface TagCellProps {
  keyId: number;
  tag: Tag;
  region: Region;
  wavesurfer: WaveSurfer | null;
  currentRecording: RecordingRel;
  setCurrentRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
}

/**
 * @description Used for quck navigation on player
 */
export const TagCell: FC<TagCellProps> = ({
  keyId,
  tag,
  region,
  wavesurfer,
  currentRecording,
  setCurrentRecording,
}) => {
  // Define behavior for actions
  const navigateTo = (where: number) => {
    wavesurfer && wavesurfer.setTime(where);
  };

  const deleteTag = async (key: number) => {
    await TagService.delete(tag.id);

    const newTags = currentRecording.tags;
    newTags.splice(key, 1);

    setCurrentRecording({ ...currentRecording, tags: newTags });
    region && region.remove();
  };

  // Choose icon
  const icon = tag.tag_type == "MODELTAG" ?
    <Icon24RobotOutline /> :
    <Icon24User />;

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
