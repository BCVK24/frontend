import { FC, useEffect, useRef, useState } from "react";
import {
  Icon28Pause,
  Icon28Play,
  Icon28AddCircleOutline,
  Icon28EditorCutOutline,
  Icon28DownloadOutline,
} from "@vkontakte/icons";
import {
  Group,
  Flex,
  Div,
  ButtonGroup,
  IconButton,
  GroupProps,
  NativeSelect,
} from "@vkontakte/vkui";
import { openResults } from "./Results";
import WaveSurfer from "wavesurfer.js";
import { TagService } from "../services/tag";
import { RecordingRel } from "../models/relschemas";
import { ResultService } from "../services";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { POLLING_INTERVAL } from "../env";
import { NotifyBar } from "./SnackBar";
import { TagType2Color } from "../colors";

interface PlayerControlsProps extends GroupProps {
  wavesurfer: WaveSurfer | null;
  recording: RecordingRel;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  setPopout: React.Dispatch<
    React.SetStateAction<React.JSX.Element | null | undefined>
  >;
  wsRegionsRef: React.MutableRefObject<RegionsPlugin | undefined | null>;
}

/**
 * @description Group of buttons that controls player and more
 */
export const PlayerControls: FC<PlayerControlsProps> = ({
  wavesurfer,
  recording,
  setRecording,
  setPopout,
  wsRegionsRef,
}) => {
  const [pollingResultId, setPollingResultId] = useState<undefined | number>();
  const timerIdRef = useRef<number | undefined>(undefined);
  const resultsTargetRef = useRef(null);
  const [snackbar, setSnackbar] = useState<null | React.JSX.Element>(null);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const createResult = async () => {
    if (!recording) return;
    const result = await ResultService.create(recording?.id);
    result && setPollingResultId(result.id);
  };

  useEffect(() => {
    const pollingCallback = async () => {
      if (!pollingResultId) return;

      const result = await ResultService.get(pollingResultId);

      if (!result) return;

      if (!result.processing) {
        setPollingResultId(undefined);

        setSnackbar(<NotifyBar setSnackBar={setSnackbar} text="Результат успешно обработан" />)

        const results = recording.results;
        results.push(result);
        setRecording({ ...recording, results: results });
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, POLLING_INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (pollingResultId) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [pollingResultId]);

  const createTag = async () => {
    const tag =
      wavesurfer && recording?.id
        ? await TagService.create(
            wavesurfer.getCurrentTime(),
            wavesurfer.getCurrentTime() + 10,
            recording?.id,
            `Отрезок ${recording.tags.length + 1}`
          )
        : undefined;

    const new_tags = recording?.tags;
    tag == undefined || new_tags?.push(tag);
    setRecording({ ...recording, tags: new_tags });
    //console.log("NEW RECORDING", recording);

    tag &&
      wsRegionsRef.current?.addRegion({
        id: (recording?.tags.length - 1 || 0).toString(),
        start: tag.start,
        end: tag.end,
        content: tag.description,
        color: TagType2Color(tag.tag_type)
      });
    //console.log("IN PLAYER", wsRegionsRef.current?.getRegions());
  };

  return (
    <Group>
      <Flex align="center" justify="center">
        <Div>
          <ButtonGroup>
            <IconButton onClick={onPlayPause}>
              {wavesurfer && wavesurfer.isPlaying() ? (
                <Icon28Pause color="var(--vkui--color_icon_accent)" />
              ) : (
                <Icon28Play color="var(--vkui--color_icon_accent)" />
              )}
            </IconButton>

            <IconButton onClick={createTag}>
              <Icon28AddCircleOutline color="var(--vkui--color_icon_accent)" />
            </IconButton>

            <IconButton
              onClick={createResult}
              disabled={wsRegionsRef.current?.getRegions().length == 0}
            >
              <Icon28EditorCutOutline color="var(--vkui--color_icon_accent)" />
            </IconButton>

            <IconButton
              onClick={() => {
                openResults(recording.results, setPopout, resultsTargetRef);
              }}
              getRootRef={resultsTargetRef}
              disabled={recording.results.length == 0}
            >
              <Icon28DownloadOutline color="var(--vkui--color_icon_accent)" />
            </IconButton>

            <NativeSelect 
            defaultValue={1} 
            onChange={(e) => {
                wavesurfer?.setPlaybackRate(+e.target.value, true)
            }}>
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </NativeSelect>
          </ButtonGroup>
        </Div>
      </Flex>
      {snackbar}
    </Group>
  );
};
