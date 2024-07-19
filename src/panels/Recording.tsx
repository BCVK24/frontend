import { useParams, useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  IconButton,
  Input,
  NavIdProps,
  Panel,
  PanelHeader,
  PanelHeaderBack,
  ScreenSpinner
} from "@vkontakte/vkui";
import { FC, useEffect, useRef } from "react";
import { RecordingService, TagService } from "../services";
import { ErrorMessage, useCustomWave, PlayerControls, TagsList } from "../components";
import { Icon16CheckCircle } from "@vkontakte/icons";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.js";
import { Tag } from "../models/schemas";
import { RecordingRel, UserRel } from "../models/relschemas";
import { TagType2Color } from "../colors";

interface RecordingPanelProps extends NavIdProps {
  setPopout: React.Dispatch<
    React.SetStateAction<React.JSX.Element | null | undefined>
  >;
  recording: RecordingRel | undefined;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  user: UserRel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
  setCurrentTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
  setCurrentRegion: React.Dispatch<React.SetStateAction<Region | undefined>>;
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
  setCurrentRegion
}) => {
  const routeNavigator = useRouteNavigator();
  const recordingId = useParams<"recording_id">()?.recording_id;
  const wavesurferRef = useRef(null);
  const clearPopout = () => setPopout(null)

  useEffect(() => {
    clearPopout()
    async function fetchData() {
      const recording = recordingId
        ? await RecordingService.get_info(+recordingId)
        : undefined;
      setRecording(recording);
      recording && setPopout(<ScreenSpinner state="loading" />)
      setTimeout(clearPopout, 10000);
    }
    fetchData();
  }, [recordingId]);

  const { wavesurfer } = useCustomWave(wavesurferRef, recording);
  const wsRegions = wavesurfer?.registerPlugin(RegionsPlugin.create());
  const wsRegionsRef = useRef<RegionsPlugin | undefined>(wsRegions);
  const rename = async (e) => {
    await RecordingService.update(recording)
  }

  useEffect(() => {
    wavesurfer?.on("decode", () => {
      for (const [id, tag] of (
        recording?.tags.sort((a, b) => a.start - b.start) || []
      ).entries()) {
        if (tag.tag_type != "SOURCETAG")
        wsRegions?.addRegion({
          id: id.toString(),
          start: tag.start,
          end: tag.end,
          content: tag.description,
          color: TagType2Color(tag.tag_type),
          drag: true,
          resize: true,
        });
      }
      wsRegionsRef.current = wsRegions;
    });
    wavesurfer?.on('redrawcomplete', () => {
      setPopout(<ScreenSpinner state="done">Успешно</ScreenSpinner>);
      setTimeout(clearPopout, 1000);
    })
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
            {
              ...recording?.tags[+region.id],
              start: region.start,
              end: region.end,
            },
          ));
      }
    });
    wsRegions?.on("region-clicked", (region: Region, e) => {
      e.preventDefault()
      recording && setCurrentTag(recording.tags[+region.id]);
      setCurrentRegion(region)
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
          value={recording.title}
          onChange={(e) => setRecording({...recording, title: e.target.value})}
          after={
            <IconButton
              onClick={rename}
            >
              <Icon16CheckCircle fill="var(--vkui--color_icon_accent)" />
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
