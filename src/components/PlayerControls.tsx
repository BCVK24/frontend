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
} from "@vkontakte/vkui";
import { openResults } from "./Results";
import WaveSurfer from "wavesurfer.js";
import { TagService } from "../services/tag";
import { RecordingRel } from "../models/relschemas";
import { ResultService } from "../services";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { POLLING_INTERVAL } from "../env";

interface PlayerControlsProps extends GroupProps {
  wavesurfer: WaveSurfer | null;
  recording: RecordingRel;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  setPopout: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
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
      console.log("Polling...");

      if (!result) return;

      if (!result.processing) {
        setPollingResultId(undefined);
        console.log("Stopped polling.");

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
                <Icon28Pause color="#5181B8" />
              ) : (
                <Icon28Play color="#5181B8" />
              )}
            </IconButton>

            <IconButton onClick={createTag}>
              <Icon28AddCircleOutline color="#5181B8" />
            </IconButton>

            <IconButton
              onClick={createResult}
              disabled={wsRegionsRef.current?.getRegions().length == 0}
            >
              <Icon28EditorCutOutline color="#5181B8" />
            </IconButton>

            <IconButton
              onClick={() => {
                openResults(recording.results, setPopout, resultsTargetRef);
              }}
              getRootRef={resultsTargetRef}
              disabled={recording.results.length == 0}
            >
              <Icon28DownloadOutline color="#5181B8" />
            </IconButton>
          </ButtonGroup>
        </Div>
      </Flex>
    </Group>
  );
};
