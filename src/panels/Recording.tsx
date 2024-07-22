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
import { iconAccent, TagType2Color } from "../colors";
import { getTag, upTag } from "../utils";

interface RecordingPanelProps extends NavIdProps {
  currentRecording: RecordingRel | undefined;
  currentUser: UserRel | undefined;

  setCurrentRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
  setCurrentTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
  setCurrentRegion: React.Dispatch<React.SetStateAction<Region | undefined>>;

  setPopout: React.Dispatch<React.SetStateAction<React.JSX.Element | null | undefined>>;
}

/**
 * @description Panel for chosen recording
 */
export const RecordingPanel: FC<RecordingPanelProps> = ({
  id,
  currentRecording,
  setCurrentRecording,
  setCurrentTag,
  setCurrentRegion,
  setPopout,
}) => {
  // Variables and more
  const routeNavigator = useRouteNavigator();
  const recordingId = useParams<"recording_id">()?.recording_id;
  const wavesurferRef = useRef(null);

  // Fetch recording by id
  useEffect(() => {
    setPopout(null)
    async function fetchData() {
      if (!recordingId) return;

      setPopout(<ScreenSpinner state="loading" />)
      setTimeout(() => setPopout(null), 10000);

      const recording = recordingId
        ? await RecordingService.get_info(+recordingId)
        : undefined;
      setCurrentRecording(recording);
    }
    fetchData();
  }, [recordingId]);

  // Init wavesurfer
  const { wavesurfer } = useCustomWave(wavesurferRef, currentRecording);
  const wsRegions = wavesurfer?.registerPlugin(RegionsPlugin.create());
  const wsRegionsRef = useRef<RegionsPlugin | undefined>(wsRegions);

  // Add regions
  useEffect(() => {
    wavesurfer?.on("decode", () => {
      const sortedTags = currentRecording?.display_tags.sort((a, b) => a.start - b.start)
      for (const tag of sortedTags || []) {
        if (tag.tag_type != "SOURCETAG") {
          wsRegions?.addRegion({
            id: tag.id.toString(),
            start: tag.start,
            end: tag.end,
            content: tag.description,
            color: TagType2Color(tag.tag_type),
            drag: true,
            resize: true,
          });
        }
      }
      wsRegionsRef.current = wsRegions;

      setPopout(<ScreenSpinner state="done">Успешно</ScreenSpinner>);
      setTimeout(() => setPopout(null), 1000);
    });
  }, [wavesurfer]);

  // Subscribe on events
  useEffect(() => {
    wsRegions?.on(
      "region-updated", 
      async (region) => {
        console.log(region, currentRecording?.display_tags)
        const chosenTag = getTag(+region.id, currentRecording?.display_tags);
        if (currentRecording && chosenTag) {
          const new_tag: Tag = {
            ...chosenTag,
            start: region.start,
            end: region.end,
          };

          const new_tags = upTag(new_tag, currentRecording.display_tags);

          console.log('NEW TAGS', new_tags)

          setCurrentRecording({ ...currentRecording, display_tags: new_tags });

          await TagService.update(new_tag)
        }
      }
    );
    wsRegions?.on(
      "region-clicked", 
      (region: Region, e) => {
        e.preventDefault()

        currentRecording && setCurrentTag(getTag(+region.id, currentRecording.display_tags));
        setCurrentRegion(region)

        routeNavigator.showModal("abouttag");
      }
    );
  }, [wsRegions]);

  return !currentRecording ? (
    <Panel id={id}>
      <ErrorMessage
        header="Вы не имеете доступа к этой записе"
        subheader="Проверьте правильность адреса"
      />
    </Panel>
  ) : (
    <Panel id={id}>
      <PanelHeader
        before={<PanelHeaderBack onClick={() => routeNavigator.push("/")} />}
      >
        <Input
          value={currentRecording.title}
          onChange={(e) => setCurrentRecording({...currentRecording, title: e.target.value})}
          after={
            <IconButton
              onClick={async () => await RecordingService.update(currentRecording)}
            >
              <Icon16CheckCircle fill={iconAccent} />
            </IconButton>
          }
        />
      </PanelHeader>

      <div ref={wavesurferRef} />

      <PlayerControls
        wavesurfer={wavesurfer}
        wsRegionsRef={wsRegionsRef}
        currentRecording={currentRecording}
        setCurrentRecording={setCurrentRecording}
        setPopout={setPopout}
      />

      <TagsList
        wavesurfer={wavesurfer}
        wsRegionsRef={wsRegionsRef}
        currentRecording={currentRecording}
        setCurrentRecording={setCurrentRecording}
      />
    </Panel>
  );
};
