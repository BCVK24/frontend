import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import { SplitCol, SplitLayout, View, ModalRoot } from "@vkontakte/vkui";

import { HomePanel, RecordingPanel } from "./panels";
import { DND } from "./modals";

export const App = () => {
  const routeNavigator = useRouteNavigator();
  const { panel: activePanel = "home", modal: activeModal } =
    useActiveVkuiLocation();
  const modals = (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <DND id="dnd" />
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modals}>
      <SplitCol>
        <View activePanel={activePanel}>
          <HomePanel id="home" />
          <RecordingPanel id="recording" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
