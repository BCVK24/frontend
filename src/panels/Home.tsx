import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  ButtonGroup,
  Flex,
  Group,
  NavIdProps,
  Panel,
  PanelHeader,
  ToolButton,
  Header,
} from "@vkontakte/vkui";
import { FC, useEffect, useState } from "react";
import { UserService } from "../services/user";
import {
  Icon20MusicMic,
  Icon24MusicMic,
  Icon24Upload,
  Icon20UploadOutline,
} from "@vkontakte/icons";
import { RecordingCell } from "../components/RecordingCell";
import { UserRel } from "../models/relschemas";

export interface HomeProps extends NavIdProps {}

export const HomePanel: FC<HomeProps> = ({ id }) => {
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
    <Panel id={id}>Что-то пошло не так</Panel>
  ) : (
    <Panel id={id}>
      <PanelHeader>CleanCast</PanelHeader>
      <Group>
        <Flex align="center" justify="center">
          <ButtonGroup>
            <ToolButton
              IconCompact={Icon20MusicMic}
              IconRegular={Icon24MusicMic}
              direction="row"
            >
              Записать
            </ToolButton>

            <ToolButton
              IconCompact={Icon20UploadOutline}
              IconRegular={Icon24Upload}
              direction="row"
              onClick={() => {
                routeNavigator.showModal("dnd");
              }}
            >
              Загрузить
            </ToolButton>
          </ButtonGroup>
        </Flex>
      </Group>

      <Group header={<Header mode="secondary">Ваши записи</Header>}>
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
