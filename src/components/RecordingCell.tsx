import { FC } from "react";
import { Recording } from "../models/schemas";
import { RichCellProps, RichCell, ButtonGroup, Button } from "@vkontakte/vkui";
import { RouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { RecordingService } from "../services/recording";
import { MilToNorm } from "../utils/tagtosec";

interface RecordingCellProps extends RichCellProps {
  recording: Recording;
  router: RouteNavigator;
}

export const RecordingCell: FC<RecordingCellProps> = ({
  recording,
  router,
}) => {
  return (
    <RichCell
      caption={recording.created_at.toLocaleString("ru-RU")}
      after={MilToNorm(recording.duration)}
      actions={
        <ButtonGroup mode="horizontal" gap="s" stretched>
          <Button
            mode="primary"
            size="s"
            onClick={() => router.push(`/recording/${recording.id}`)}
          >
            Открыть
          </Button>
          <Button
            mode="secondary"
            size="s"
            onClick={() => {
              RecordingService.delete(recording.id);
            }}
          >
            Удалить
          </Button>
        </ButtonGroup>
      }
    >
      {recording.title}
    </RichCell>
  );
};
