import bridge, { UserInfo } from "@vkontakte/vk-bridge";
import { useActiveVkuiLocation } from "@vkontakte/vk-mini-apps-router";
import { ScreenSpinner, SplitCol, SplitLayout, View } from "@vkontakte/vkui";
import { ReactNode, useEffect, useState } from "react";

import { HomePanel, RecordingPanel } from "./panels";

export const App = () => {
  const { panel: activePanel = "home" } = useActiveVkuiLocation();
  const [fetchedUser, setUser] = useState<UserInfo | undefined>();
  const [popout, setPopout] = useState<ReactNode | null>(
    <ScreenSpinner size="large" />,
  );

  useEffect(() => {
    async function fetchData() {
      //const user = await bridge.send("VKWebAppGetUserInfo");
      // TODO REMOVE
      const user = {
        id: 0,
        first_name: "Gleb",
        last_name: "Hleb",
        sex: 0,
        city: { id: 0, title: "Kemerovo" },
        country: { id: 0, title: "Nope" },
        photo_100: "",
        photo_200: "",
      };
      setUser(user);
      setPopout(null);
    }
    fetchData();
  }, []);

  return (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <HomePanel id="home" fetchedUser={fetchedUser} />
          <RecordingPanel id="recording" />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
