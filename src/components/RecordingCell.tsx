import { FC } from "react";
import {
  RichCellProps,
  RichCell,
  ButtonGroup,
  Button,
  Skeleton,
} from "@vkontakte/vkui";
import { RouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { RecordingService } from "../services";
import { Normalize } from "../utils/secondsConvert";
import { Recording } from "../models/schemas";
import { UserRel } from "../models/relschemas";

interface RecordingCellProps extends RichCellProps {
  recording: Recording;
  router: RouteNavigator;
  currentUser: UserRel;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
  index: number;
}

/**
 * @description For single recording, used on main screen
 */
export const RecordingCell: FC<RecordingCellProps> = ({
  recording,
  router,
  currentUser,
  setCurrentUser,
  index,
}) => {
  return recording.processing ? (
    <RichCell caption={<Skeleton width={90} />} after={<Skeleton width={30} />}>
      {<Skeleton width={200} />}
    </RichCell>
  ) : (
    <RichCell
      caption={new Date(recording.created_at).toLocaleString("ru-RU")}
      after={Normalize(recording.duration)}
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
            onClick={async () => {
              await RecordingService.delete(recording.id);
              const recordings = currentUser.recordings;
              recordings.splice(index, 1);
              setCurrentUser({ ...currentUser, recordings: recordings });
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
