import { FC } from "react";
import { SimpleCell } from "@vkontakte/vkui";
import { Icon24Mute, Icon24User } from "@vkontakte/icons";
import { Tag } from "../models/schemas";
import { TagToSeconds } from "../utils/tagtosec";
import { TagDescription } from "../models/schemas";

interface TagCellProps {
  tag: Tag;
  navigateTo: (where: number) => void;
}

export const TagCell: FC<TagCellProps> = ({ tag, navigateTo }) => {
  let icon;
  switch (tag.description) {
    case TagDescription.SILENT:
      icon = <Icon24Mute />;
      break;
    default:
      icon = <Icon24User />;
      break;
  }

  return (
    <SimpleCell
      expandable="auto"
      before={icon}
      onClick={() => navigateTo(tag.start)}
    >
      {TagToSeconds(tag.start, tag.end)}
    </SimpleCell>
  );
};
