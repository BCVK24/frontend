import { Group, Header } from "@vkontakte/vkui";
import { FC } from "react";
import { RecordingCell } from "./RecordingCell";
import { UserRel } from "../models/relschemas";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";

interface RecordingsListProps {
  user: UserRel;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
}

export const RecordingsList: FC<RecordingsListProps> = ({ user, setUser }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Group header={<Header mode="secondary">Ваши записи</Header>}>
      {user.recordings.map((recording, index) => (
        <RecordingCell
          key={recording.id}
          recording={recording}
          router={routeNavigator}
          setUser={setUser}
          user={user}
          index={index}
        />
      ))}
    </Group>
  );
};
