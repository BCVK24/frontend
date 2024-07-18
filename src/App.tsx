import { useEffect, useState } from "react";
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import { SplitCol, SplitLayout, View, ModalRoot } from "@vkontakte/vkui";

import { HomePanel, RecordingPanel } from "./panels";
import { DND } from "./modals";
import { RecordingRel, UserRel } from "./models/relschemas";
import { Tag } from "./models/schemas";
import { UserService } from "./services";
import { AboutTag } from "./modals/AboutTag";

export const App = () => {
  const routeNavigator = useRouteNavigator();
  const { panel: activePanel = "home", modal: activeModal } =
    useActiveVkuiLocation();
  const [popout, setPopout] = useState<React.JSX.Element | undefined>();
  const [recording, setRecording] = useState<RecordingRel | undefined>();
  const [currentTag, setCurrentTag] = useState<Tag | undefined>();
  const [user, setUser] = useState<UserRel | undefined>();

  useEffect(() => {
    async function fetchData() {
      const user = await UserService.get_current();
      setUser(user);
    }
    fetchData();
  }, [activePanel]);

  const modals = (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <DND id="dnd" setRecording={setRecording} user={user} setUser={setUser} />
      <AboutTag
        id="abouttag"
        recording={recording}
        setRecording={setRecording}
        currentTag={currentTag}
        setCurrentTag={setCurrentTag}
      />
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modals} popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <HomePanel id="home" user={user} setUser={setUser} />
          <RecordingPanel
            id="recording"
            setPopout={setPopout}
            recording={recording}
            setRecording={setRecording}
            setCurrentTag={setCurrentTag}
            user={user}
            setUser={setUser}
          />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
