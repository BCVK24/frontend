import { FC } from "react";
import { Recording } from "../models/schemas";
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
import { UserRel } from "../models/relschemas";

interface RecordingCellProps extends RichCellProps {
  recording: Recording;
  router: RouteNavigator;
  user: UserRel;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
  index: number;
}

const UnavaliableRecordingCell = ({}) => {
  return (
    <RichCell caption={<Skeleton width={90} />} after={<Skeleton width={30} />}>
      {<Skeleton width={200} />}
    </RichCell>
  );
};

/**
 * @description For single recording, used on main screen
 */
export const RecordingCell: FC<RecordingCellProps> = ({
  recording,
  router,
  user,
  setUser,
  index,
}) => {
  return recording.processing ? (
    <UnavaliableRecordingCell />
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
              const recordings = user.recordings;
              recordings.splice(index, 1);
              setUser({ ...user, recordings: recordings });
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
