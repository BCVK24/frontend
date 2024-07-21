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
  ActionSheet,
  ActionSheetItem,
} from "@vkontakte/vkui";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { RecordingRel } from "../models/relschemas";
import { ResultService, TagService, RecordingService } from "../services";
import { POLLING_INTERVAL } from "../env";
import { NotifyBar, openResults } from ".";
import { iconAccent, TagType2Color } from "../colors";

interface PlayerControlsProps extends GroupProps {
  wavesurfer: WaveSurfer | null;
  wsRegionsRef: React.MutableRefObject<RegionsPlugin | undefined | null>;
  currentRecording: RecordingRel;
  setCurrentRecording: React.Dispatch<
    React.SetStateAction<RecordingRel | undefined>
  >;
  setPopout: React.Dispatch<
    React.SetStateAction<React.JSX.Element | null | undefined>
  >;
}

/**
 * @description Group of buttons that controls player and more
 */
export const PlayerControls: FC<PlayerControlsProps> = ({
  wavesurfer,
  wsRegionsRef,
  currentRecording,
  setCurrentRecording,
  setPopout,
}) => {
  // Variables
  const [isPollingResults, setIsPollingResults] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<null | React.JSX.Element>(null);
  const timerIdRef = useRef<number | undefined>(undefined);
  const resultsRef = useRef(null);
  const editMenuRef = useRef(null);

  // Polling for results
  useEffect(() => {
    const pollingCallback = async () => {
      if (!isPollingResults) return;

      const recording = await RecordingService.get_info(currentRecording.id);

      if (!recording) return;

      setCurrentRecording(recording);

      if (!recording.results.some((res) => res.processing)) {
        setIsPollingResults(false);

        setSnackbar(<NotifyBar setSnackBar={setSnackbar} text="Результат успешно обработан" />)
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, POLLING_INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPollingResults) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [isPollingResults]);
  
  // Buttons behavior
  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const createResult = async () => {
    if (!currentRecording) return;

    const result = await ResultService.create(currentRecording?.id);

    result && setIsPollingResults(true);
  };

  const createTag = async () => {
    // Call API
    const tag =
      wavesurfer && currentRecording?.id
        ? await TagService.create(
            wavesurfer.getCurrentTime(),
            wavesurfer.getCurrentTime() + 10,
            currentRecording?.id,
            `Отрезок ${(wsRegionsRef.current?.getRegions().length || 0) + 1}`
          )
        : undefined;

    // Update localy
    const newTags = currentRecording?.display_tags;
    tag == undefined || newTags?.push(tag);
    setCurrentRecording({ ...currentRecording, display_tags: newTags });

    // Add to regions
    tag &&
      wsRegionsRef.current?.addRegion({
        id: (currentRecording?.display_tags.length - 1 || 0).toString(),
        start: tag.start,
        end: tag.end,
        content: tag.description,
        color: TagType2Color(tag.tag_type)
      });
  };

  const loadModelTags = async () => {
    const fetchedRecording = await RecordingService.get_model_tags(currentRecording.id)

    for (const region of wsRegionsRef.current?.getRegions() || []) {
      if (currentRecording.display_tags[+region.id].tag_type == 'MODELTAG') {
        region.remove()
      }
    }

    for (const [id, tag] of (fetchedRecording?.display_tags || []).entries()) {
      if (tag.tag_type == 'MODELTAG') {
        wsRegionsRef.current?.addRegion({
          id: id.toString(),
          start: tag.start,
          end: tag.end,
          content: tag.description,
          color: TagType2Color(tag.tag_type)
        });
      }
    }

    setCurrentRecording(fetchedRecording)
  }

  const deleteModelTags = async () => {
    const fetchedRecording = await RecordingService.delete_model_tags(currentRecording.id)

    for (const region of wsRegionsRef.current?.getRegions() || []) {
      if (currentRecording.display_tags[+region.id].tag_type == 'MODELTAG') {
        region.remove()
      }
    }

    setCurrentRecording(fetchedRecording)
  }

  const openTagEditMenu = () => {
    setPopout(
      <ActionSheet onClose={() => setPopout(null)} toggleRef={editMenuRef}>
        <ActionSheetItem onClick={createTag}>Создать тег</ActionSheetItem>
        <ActionSheetItem onClick={loadModelTags}>Добавить теги модели</ActionSheetItem>
        <ActionSheetItem onClick={deleteModelTags} mode="destructive">Удалить теги модели</ActionSheetItem>
      </ActionSheet>
      )
  }

  return (
    <Group>
      <Flex align="center" justify="center">
        <Div>
          <ButtonGroup>
            <IconButton 
              onClick={onPlayPause}
            >
              {
                wavesurfer?.isPlaying() ? 
                  <Icon28Pause color={iconAccent} /> :
                  <Icon28Play color={iconAccent} />
              }
            </IconButton>

            <IconButton 
              onClick={openTagEditMenu} 
              getRootRef={editMenuRef}
            >
              <Icon28AddCircleOutline color={iconAccent} />
            </IconButton>

            <IconButton
              onClick={createResult}
              disabled={!wsRegionsRef.current?.getRegions().length}
            >
              <Icon28EditorCutOutline color={iconAccent} />
            </IconButton>

            <IconButton
              onClick={() => {
                openResults(currentRecording.results, setPopout, resultsRef);
              }}
              getRootRef={resultsRef}
              disabled={!currentRecording.results.length}
            >
              <Icon28DownloadOutline color={iconAccent} />
            </IconButton>

            <NativeSelect 
              defaultValue={1} 
              onChange={(e) => {
                  wavesurfer?.setPlaybackRate(+e.target.value, true)
              }}
            >
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
