import { UserInfo } from "@vkontakte/vk-bridge";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  Div,
  Flex,
  Group,
  NavIdProps,
  Panel,
  PanelHeader,
  ToolButton,
} from "@vkontakte/vkui";
import { FC, useEffect, useState } from "react";
import { UserService } from "../services/user";
import { Icon20MusicMic, Icon24MusicMic } from "@vkontakte/icons";
import { RecordingCell } from "../components/RecordingCell";
import { UserRel } from "../models/relschemas";

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const HomePanel: FC<HomeProps> = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  // const userId = fetchedUser?.id;
  const routeNavigator = useRouteNavigator();

  const [user, setUser] = useState<UserRel | undefined>();

  useEffect(() => {
    async function fetchData() {
      const user = await UserService.get_current();
      setUser(user);
    }
    fetchData();
  }, []);

  return user === undefined ? (
    <Panel id={id}>Something went wrong</Panel>
  ) : (
    <Panel id={id}>
      <PanelHeader>Ваши записи</PanelHeader>
      <Group>
        <Flex align="center" justify="center">
          <Div>
            <ToolButton
              IconCompact={Icon20MusicMic}
              IconRegular={Icon24MusicMic}
              direction="row"
            >
              Record
            </ToolButton>
          </Div>
        </Flex>
      </Group>

      <Group>
        {user.recordings.map((recording) => (
          <RecordingCell
            key={recording.id}
            recording={recording}
            router={routeNavigator}
          />
        ))}
      </Group>
    </Panel>
  );
};
