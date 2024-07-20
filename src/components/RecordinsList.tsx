import { FC } from "react";
import { Group, Header } from "@vkontakte/vkui";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { RecordingCell } from ".";
import { UserRel } from "../models/relschemas";

interface RecordingsListProps {
  currentUser: UserRel;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
}

export const RecordingsList: FC<RecordingsListProps> = ({ currentUser, setCurrentUser }) => {
  const routeNavigator = useRouteNavigator();

  return (
    <Group header={<Header mode="secondary">Ваши записи</Header>}>
      {currentUser.recordings.map((recording, index) => (
        <RecordingCell
          key={recording.id}
          recording={recording}
          router={routeNavigator}
          setCurrentUser={setCurrentUser}
          currentUser={currentUser}
          index={index}
        />
      ))}
    </Group>
  );
};
