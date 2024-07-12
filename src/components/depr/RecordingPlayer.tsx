import {
  Icon28AddCircleOutline,
  Icon28EditorCutOutline,
  Icon48Pause,
  Icon48Play,
} from "@vkontakte/icons";
import { ButtonGroup, Div, Flex, IconButton } from "@vkontakte/vkui";
import WavesurferPlayer from "@wavesurfer/react";
import { FC, useEffect, useState } from "react";
import { RecordingRel } from "../../models/relschemas";
import { RecordingService } from "../../services/recording";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";
//import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.esm.js";

interface RecordingPlayerProps {
  recording: RecordingRel;
}

export const RecordingPlayer: FC<RecordingPlayerProps> = ({ recording }) => {
  const [waveInfo, setWaveInfo] = useState({});
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const wave = await RecordingService.get_wave(recording.id);
      setWaveInfo(wave);
    }
    fetchData();
  }, [recording]);

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  const onReady = (ws) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onCut = () => {};

  const onAddTag = () => {};

  return waveInfo && recording ? (
    <>
      <WavesurferPlayer
        height={200}
        barWidth={2}
        barGap={1}
        barRadius={2}
        waveColor="white"
        progressColor="red"
        url="/Test.wav"
        //autoCenter={true}
        //autoScroll={true}
        minPxPerSec={0.1}
        //dragToSeek={true}
        onReady={onReady}
        // peaks={waveInfo.data}
        // duration={recording.duration}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        plugins={[
          TimelinePlugin.create(),
          Hover.create({
            lineColor: "#ff0000",
            lineWidth: 2,
            labelBackground: "#555",
            labelColor: "#fff",
            labelSize: "11px",
          }),
        ]}
      />
      <Flex align="center" justify="center">
        <ButtonGroup align="center">
          <IconButton onClick={onAddTag}>
            <Icon28AddCircleOutline color="#5181B8" />
          </IconButton>

          <IconButton onClick={onPlayPause}>
            {isPlaying ? (
              <Icon48Pause color="#5181B8" />
            ) : (
              <Icon48Play color="#5181B8" />
            )}
          </IconButton>

          <IconButton onClick={onCut}>
            <Icon28EditorCutOutline color="#5181B8" />
          </IconButton>
        </ButtonGroup>
      </Flex>
    </>
  ) : (
    <Div>Something went wrong</Div>
  );
};
