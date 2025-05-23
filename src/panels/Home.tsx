import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  ButtonGroup,
  Flex,
  Group,
  NavIdProps,
  Panel,
  PanelHeader,
  ToolButton,
} from "@vkontakte/vkui";
import { FC } from "react";
import { Icon24Upload, Icon20UploadOutline } from "@vkontakte/icons";
import { UserRel } from "../models/relschemas";
import { RecordingsList } from "../components";

export interface HomeProps extends NavIdProps {
  currentUser: UserRel | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
}

/**
 * @description Home panel with all user recordings
 */
export const HomePanel: FC<HomeProps> = ({ id, currentUser, setCurrentUser }) => {
  const routeNavigator = useRouteNavigator();

  return !currentUser ? (
    <Panel id={id}>
      {/*<ErrorMessage
        header="Что-то пошло не так"
        subheader="Возможно вы зашли в приложение не через платформу VK"
      />*/}
    </Panel>
  ) : (
    <Panel id={id}>
      <PanelHeader>CleanCast</PanelHeader>
      <Group>
        <Flex align="center" justify="center">
          <ButtonGroup>
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

      <RecordingsList currentUser={currentUser} setCurrentUser={setCurrentUser} />
    </Panel>
  );
};
