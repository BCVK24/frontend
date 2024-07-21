import { useEffect, useRef, useState } from "react";
import {
  useActiveVkuiLocation,
  useRouteNavigator,
} from "@vkontakte/vk-mini-apps-router";
import { SplitCol, SplitLayout, View, ModalRoot, ScreenSpinner } from "@vkontakte/vkui";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { HomePanel, RecordingPanel } from "./panels";
import { DND, AboutTag } from "./modals";
import { RecordingRel, UserRel } from "./models/relschemas";
import { Tag } from "./models/schemas";
import { UserService } from "./services";
import { POLLING_INTERVAL } from "./env";

export const App = () => {
  const routeNavigator = useRouteNavigator();
  const { panel: activePanel = "home", modal: activeModal } =
    useActiveVkuiLocation();
  const [popout, setPopout] = useState<React.JSX.Element | null>();
  const [currentRecording, setCurrentRecording] = useState<RecordingRel | undefined>();
  const [currentTag, setCurrentTag] = useState<Tag | undefined>();
  const [currentRegion, setCurrentRegion] = useState<Region | undefined>();
  const [currentUser, setCurrentUser] = useState<UserRel | undefined>();
  const [fetchRecordings, setFetchRecordings] = useState<boolean>(false);
  const timerIdRef = useRef<number | undefined>(undefined);
  const clearPopout = () => setPopout(null);

  // Pull user
  useEffect(() => {
    const pollingCallback = async () => {
      if (!fetchRecordings) return;

      const fetchedUser = fetchRecordings
        ? await UserService.get_current()
        : undefined;

      setCurrentUser(fetchedUser)

      if (!fetchedUser?.recordings.some((rec) => rec.processing)) {
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

  // Initial fetch
  useEffect(() => {
    setPopout(<ScreenSpinner state="loading" />);

    const fetchingCallback = async () => {
      const fetchedUser = await UserService.get_current()

      if (fetchedUser?.recordings.some((rec) => rec.processing)) {
        setFetchRecordings(true);
      }

      if (fetchedUser) {
        setCurrentUser(fetchedUser)
        activePanel == "home" && setPopout(<ScreenSpinner state="done" />)
      } else {
        activePanel == "home" && setPopout(<ScreenSpinner state="error" />)
      }
      activePanel == "home" && setTimeout(clearPopout, 1000)
    };

    fetchingCallback()
  }, [])

  // Modals
  const modals = (
    <ModalRoot
      activeModal={activeModal}
      onClose={() => routeNavigator.hideModal()}
    >
      <DND 
        id="dnd"
        setCurrentRecording={setCurrentRecording}
        currentUser={currentUser} 
        setCurrentUser={setCurrentUser} 
        setFetchRecordings={setFetchRecordings} 
      />
      <AboutTag
        id="abouttag"
        currentRecording={currentRecording}
        currentTag={currentTag}
        currentRegion={currentRegion}
        setCurrentTag={setCurrentTag}
      />
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modals} popout={popout} aria-live="polite" aria-busy={!!popout}>
      <SplitCol>
        <View activePanel={activePanel}>
          <HomePanel id="home" currentUser={currentUser} setCurrentUser={setCurrentUser}/>
          <RecordingPanel
            id="recording"
            setPopout={setPopout}
            currentRecording={currentRecording}
            setCurrentRecording={setCurrentRecording}
            setCurrentTag={setCurrentTag}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setCurrentRegion={setCurrentRegion}
          />
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
