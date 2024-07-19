import { useEffect, useRef, useState } from "react";
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import { SplitCol, SplitLayout, View, ModalRoot, ScreenSpinner } from "@vkontakte/vkui";

import { HomePanel, RecordingPanel } from "./panels";
import { DND, AboutTag } from "./modals";
import { RecordingRel, UserRel } from "./models/relschemas";
import { Tag } from "./models/schemas";
import { UserService } from "./services";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { POLLING_INTERVAL } from "./env";

export const App = () => {
  const routeNavigator = useRouteNavigator();
  const { panel: activePanel = "home", modal: activeModal } =
    useActiveVkuiLocation();
  const [popout, setPopout] = useState<React.JSX.Element | null>();
  const [recording, setRecording] = useState<RecordingRel | undefined>();
  const [currentTag, setCurrentTag] = useState<Tag | undefined>();
  const [currentRegion, setCurrentRegion] = useState<Region | undefined>();
  const [user, setUser] = useState<UserRel | undefined>();
  const [fetchRecordings, setFetchRecordings] = useState<boolean>(false);
  const timerIdRef = useRef<number | undefined>(undefined);
  const clearPopout = () => setPopout(null);


  useEffect(() => {
    const pollingCallback = async () => {
      const user = fetchRecordings
        ? await UserService.get_current()
        : undefined;
      console.log("YEAHYADH")

      if (user) {
        setUser(user);
        setPopout(<ScreenSpinner state="done">Успешно</ScreenSpinner>);
        setTimeout(clearPopout, 1000);
      } else {
        setPopout(<ScreenSpinner state="error">Произошла ошибка</ScreenSpinner>);
        setTimeout(clearPopout, 1000); 
        stopPolling()  
      }

      if (!user?.recordings.some((rec) => rec.processing)) {
        setFetchRecordings(false);
        stopPolling();
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, POLLING_INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (fetchRecordings) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [fetchRecordings]);

  useEffect(() => {
    clearPopout()
    console.log("NOOO")
    !user && setPopout(<ScreenSpinner state="loading" />);
    !user && setFetchRecordings(true);
    setTimeout(() => {clearPopout(); setFetchRecordings(false)}, 10000);
  }, [])

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
        currentRegion={currentRegion}
        setCurrentRegion={setCurrentRegion}
      />
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modals} popout={popout} aria-live="polite" aria-busy={!!popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <HomePanel id="home" user={user} setUser={setUser}/>
          <RecordingPanel
            id="recording"
            setPopout={setPopout}
            recording={recording}
            setRecording={setRecording}
            setCurrentTag={setCurrentTag}
            user={user}
            setUser={setUser}
            setCurrentRegion={setCurrentRegion}
          />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
