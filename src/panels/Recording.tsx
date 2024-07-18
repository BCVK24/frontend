import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  IconButton,
  Input,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
} from "@vkontakte/vkui";
import { FC, useEffect, useRef, useState } from "react";
import { RecordingRel, UserRel } from "../models/relschemas";
import { RecordingService } from "../services";
import { ErrorMessage } from "../components/ErrorMessage";
import { useCustomWave } from "../components/CustomWave";
import { PlayerControls } from "../components/PlayerControls";
import { Icon16CheckCircle } from "@vkontakte/icons";
import { TagsList } from "../components/TagsList";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { Tag } from "../models/schemas";
import { TagService } from "../services/tag";

interface RecordingPanelProps extends NavIdProps {
  setPopout: React.Dispatch<
    React.SetStateAction<React.JSX.Element | undefined>
  >;
  recording: RecordingRel | undefined;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  user: UserRel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
  setCurrentTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
}

/**
 * @description Panel for chosen recording
 */
export const RecordingPanel: FC<RecordingPanelProps> = ({
  id,
  setPopout,
  recording,
  setRecording,
  setCurrentTag,
}) => {
  const routeNavigator = useRouteNavigator();
  const recordingId = useParams<"recording_id">()?.recording_id;
  const [recordingName, setRecordingName] = useState<string | undefined>();
  const wavesurferRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const recording = recordingId
        ? await RecordingService.get_info(+recordingId)
        : undefined;
      setRecording(recording);
      recording && setRecordingName(recording.title);
    }
    fetchData();
  }, [recordingId]);

  const { wavesurfer } = useCustomWave(wavesurferRef, recording);
  const wsRegions = wavesurfer?.registerPlugin(RegionsPlugin.create());
  const wsRegionsRef = useRef<RegionsPlugin | undefined>(wsRegions);

  useEffect(() => {
    wavesurfer?.on("decode", () => {
      for (const [id, tag] of (
        recording?.tags.sort((a, b) => a.start - b.start) || []
      ).entries()) {
        wsRegions?.addRegion({
          id: id.toString(),
          start: tag.start,
          end: tag.end,
          content: tag.description,
          color:
            tag.description == "CUSTOM"
              ? "rgba(0,255,255,0.5)"
              : "rgba(255,0,0,0.5)",
          drag: true,
          resize: true,
        });
      }
      wsRegionsRef.current = wsRegions;
    });
  }, [wavesurfer]);

  useEffect(() => {
    wsRegions?.on("region-updated", async (region) => {
      if (recording?.tags[+region.id]) {
        const new_tag: Tag = {
          ...recording.tags[+region.id],
          start: region.start,
          end: region.end,
        };
        const new_tags = recording.tags;
        new_tags[+region.id] = new_tag;
        setRecording({ ...recording, tags: new_tags });
        await (recording?.tags[+region.id].id &&
          TagService.update(
            recording?.tags[+region.id].id,
            region.start,
            region.end,
          ));
      }
    });
    wsRegions?.on("region-clicked", (region: Region, e) => {
      recording && setCurrentTag(recording.tags[+region.id]);
      routeNavigator.showModal("abouttag");
    });
  }, [wsRegions]);

  return !recording ? (
    <Panel id={id}>
      <ErrorMessage
        header="Вы не имеете доступа к этой записе"
        subheader="Проверьте правильность числа в адресе"
      />
    </Panel>
  ) : (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.push("/")} />}
      >
        <Input
          value={recordingName}
          onChange={(e) => setRecordingName(e.target.value)}
          after={
            <IconButton
              onClick={() => {
                setRecording({ ...recording, title: recordingName || "" });
              }}
              color={recording.title == recordingName ? undefined : "blue"}
            >
              <Icon16CheckCircle />
            </IconButton>
          }
        />
      </PanelHeader>
      <div ref={wavesurferRef} />
      <PlayerControls
        wavesurfer={wavesurfer}
        recording={recording}
        setRecording={setRecording}
        setPopout={setPopout}
        wsRegionsRef={wsRegionsRef}
      />
      <TagsList
        wsRegionsRef={wsRegionsRef}
        wavesurfer={wavesurfer}
        recording={recording}
        setRecording={setRecording}
      />
    </Panel>
  );
};
