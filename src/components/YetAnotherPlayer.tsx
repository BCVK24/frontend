import { Icon48Pause, Icon48Play } from "@vkontakte/icons";
import { ButtonGroup, Div, IconButton } from "@vkontakte/vkui";
import WaveSurfer, { useWavesurfer } from "@wavesurfer/react";
import { FC, useCallback, useMemo, useRef } from "react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { RecordingRel } from "../models/relschemas";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import Hover from "wavesurfer.js/dist/plugins/hover.esm.js";

interface RecordingPlayerProps {
  recording: RecordingRel;
}

export const RecordingPlayer2: FC<RecordingPlayerProps> = ({ recording }) => {
  const containerRef = useRef(null);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    waveColor: "blue",
    progressColor: "red",
    url: "/2min.wav",
    // peaks: [wave.data],
    duration: recording?.duration,
    plugins: useMemo(
      () => [Timeline.create(), RegionsPlugin.create(), Hover.create()],
      [],
    ),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div ref={containerRef} />

      <ButtonGroup align="center">
        <Div>
          <IconButton onClick={onPlayPause}>
            {isPlaying ? (
              <Icon48Pause color="#5181B8" />
            ) : (
              <Icon48Play color="#5181B8" />
            )}
          </IconButton>
        </Div>
      </ButtonGroup>
    </>
  );
};
