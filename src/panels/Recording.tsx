import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  Group,
  IconButton,
  ActionSheet,
  ActionSheetItem,
  Div,
  Flex,
  AdaptiveIconRenderer,
  SplitCol,
  SplitLayout,
  View,
  ButtonGroup,
} from "@vkontakte/vkui";
import {
  Icon20DownloadOutline,
  Icon28DownloadOutline,
  Icon28EditorCutOutline,
  Icon28AddCircleOutline,
} from "@vkontakte/icons";
import { FC, useState, useEffect, useRef } from "react";
import { RecordingRel } from "../models/relschemas";
import { Result } from "../models/schemas";
//import { RecordingPlayer } from "../components/RecordingPlayer";
//import { RecordingPlayer2 } from "../components/AnotherPlayer";
import { RecordingPlayer2 } from "../components/YetAnotherPlayer";
import { RecordingService } from "../services/recording";
import { ResultService } from "../services/result";

export const RecordingPanel: FC<NavIdProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const recordingId = useParams<"recording_id">()?.recording_id;
  const [recording, setRecording] = useState<RecordingRel | undefined>();
  const [popout, setPopout] = useState<React.JSX.Element | undefined>(
    undefined,
  );
  const resultsTargetRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const recording = await RecordingService.get_info(+recordingId);
      setRecording(recording);
    }
    fetchData();
  }, [recordingId]);

  const closeResults = () => {
    setPopout(undefined);
  };

  const openResults = (results: Array<Result>) => {
    setPopout(
      <ActionSheet
        onClose={closeResults}
        toggleRef={resultsTargetRef}
        placement="top-end"
      >
        {results.map((res) => (
          <ActionSheetItem
            before={
              <AdaptiveIconRenderer
                IconCompact={Icon20DownloadOutline}
                IconRegular={Icon28DownloadOutline}
              />
            }
            key={res.id}
          >
            {res.created_at.toLocaleString("ru-RU")}
          </ActionSheetItem>
        ))}
      </ActionSheet>,
    );
  };

  return !recording ? (
    <Panel id={id}>No recording found</Panel>
  ) : (
    <SplitLayout popout={popout}>
      <SplitCol>
        <View activePanel={id}>
          <Panel id={id}>
            <PanelHeader
              before={<PanelHeaderBack onClick={() => routeNavigator.back()} />}
            >
              {recording.title}
            </PanelHeader>

            <RecordingPlayer2 recording={recording} />

            <Group>
              <Flex align="center" justify="center">
                <Div>
                  <ButtonGroup>
                    <IconButton
                      onClick={() => {
                        openResults(recording.results);
                      }}
                      getRootRef={resultsTargetRef}
                    >
                      <Icon28DownloadOutline />
                    </IconButton>

                    <IconButton>
                      <Icon28AddCircleOutline color="#5181B8" />
                    </IconButton>

                    <IconButton>
                      <Icon28EditorCutOutline color="#5181B8" />
                    </IconButton>
                  </ButtonGroup>
                </Div>
              </Flex>
            </Group>
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
