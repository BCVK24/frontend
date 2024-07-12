import {
  Icon20DownloadOutline,
  Icon28AddCircleOutline,
  Icon28DownloadOutline,
  Icon28EditorCutOutline,
  Icon28Pause,
  Icon28Play,
} from "@vkontakte/icons";
import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  ActionSheet,
  ActionSheetItem,
  AdaptiveIconRenderer,
  ButtonGroup,
  Div,
  Flex,
  Group,
  Header,
  IconButton,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  SplitCol,
  SplitLayout,
  View,
} from "@vkontakte/vkui";
import { useWavesurfer } from "@wavesurfer/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { RecordingRel } from "../models/relschemas";
import { Result } from "../models/schemas";
import { RecordingService } from "../services/recording";
import { TagCell } from "../components/TagCell";
import { ResultService } from "../services/result";
import { TagService } from "../services/tag";
import { SERVER_URL } from "../env";

interface RecordingPanelProps extends NavIdProps {}

export const RecordingPanel: FC<RecordingPanelProps> = ({ id }) => {
  const routeNavigator = useRouteNavigator();
  const recordingId = useParams<"recording_id">()?.recording_id;
  const [recording, setRecording] = useState<RecordingRel | undefined>();
  const [popout, setPopout] = useState<React.JSX.Element | undefined>(
    undefined,
  );
  const resultsTargetRef = useRef(null);
  const wavesurferRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const recording = await RecordingService.get_info(+recordingId);
      setRecording(recording);
      console.log(`${SERVER_URL}/${recording?.url}`);
    }
    fetchData();
  }, [recordingId]);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: wavesurferRef,
    height: 100,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    waveColor: "blue",
    progressColor: "red",
    url: `${SERVER_URL}/${recording?.url}`,
    peaks: recording?.soundwave
      ? [JSON.parse(recording?.soundwave)]
      : undefined,
    duration: recording?.duration,
    plugins: useMemo(
      () => [Timeline.create(), RegionsPlugin.create(), Hover.create()],
      [],
    ),
  });

  useEffect(() => {
    const wsRegions = wavesurfer?.registerPlugin(RegionsPlugin.create());

    wavesurfer?.on("decode", () => {
      for (const tag of recording?.tags || []) {
        wsRegions?.addRegion({
          start: tag.start / 1000,
          end: tag.end / 1000,
          content: tag.description,
          color: "green",
          drag: false,
          resize: true,
        });
      }
    });
  });

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
            onClick={() => ResultService.download(res.id)}
          >
            {new Date(res.created_at).toLocaleString("ru-RU")}
          </ActionSheetItem>
        ))}
      </ActionSheet>,
    );
  };

  const navigateTo = useCallback(
    (where: number) => {
      wavesurfer && wavesurfer.setTime(where / 1000);
    },
    [wavesurfer],
  );

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const createTag = useCallback(async () => {
    recording?.tags.push(
      await TagService.create(currentTime, currentTime + 10000, recording.id),
    );
    setRecording(recording);
  }, [recording?.id, currentTime]);

  const createResult = useCallback(async () => {
    await ResultService.create(recording.id);
  }, [recording?.id]);

  return !recording ? (
    <Panel id={id}>Такой записи не существует</Panel>
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

            <div ref={wavesurferRef} />

            <Group>
              <Flex align="center" justify="center">
                <Div>
                  <ButtonGroup>
                    <IconButton onClick={onPlayPause}>
                      {isPlaying ? <Icon28Pause /> : <Icon28Play />}
                    </IconButton>

                    <IconButton
                      onClick={() => {
                        openResults(recording.results);
                      }}
                      getRootRef={resultsTargetRef}
                    >
                      <Icon28DownloadOutline />
                    </IconButton>

                    <IconButton onClick={createTag}>
                      <Icon28AddCircleOutline color="#5181B8" />
                    </IconButton>

                    <IconButton onClick={createResult}>
                      <Icon28EditorCutOutline color="#5181B8" />
                    </IconButton>
                  </ButtonGroup>
                </Div>
              </Flex>
            </Group>

            {recording.tags.length ? (
              <Group
                header={<Header mode="secondary">Проблемные участки</Header>}
              >
                {recording.tags.map((tag) => (
                  <TagCell tag={tag} navigateTo={navigateTo} key={tag.id} />
                ))}
              </Group>
            ) : (
              <Div>В этой записи нет проблемных участков</Div>
            )}
          </Panel>
        </View>
      </SplitCol>
    </SplitLayout>
  );
};
