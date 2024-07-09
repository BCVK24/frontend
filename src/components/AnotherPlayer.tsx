import { useMemo, useState, useCallback, useRef, useEffect, FC } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import Timeline from "wavesurfer.js/dist/plugins/timeline.esm.js";
import { RecordingRel } from "../models/relschemas";
import { WaveForm } from "../models/schemas";
import { RecordingService } from "../services/recording";

interface RecordingPlayerProps {
  recording: RecordingRel;
}

export const RecordingPlayer2: FC<RecordingPlayerProps> = ({ recording }) => {
  const containerRef = useRef(null);
  const [wave, setWave] = useState<WaveForm>();

  useEffect(() => {
    async function fetchData() {
      const waveInfo = await RecordingService.get_wave(recording.id);
      setWave(waveInfo);
    }
    fetchData();
  }, [recording.id]);

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 100,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    waveColor: "blue",
    progressColor: "red",
    url: "/2min.wav",
    peaks: wave ? [wave.data] : undefined,
    duration: recording?.duration,
    plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  return (
    <>
      <div ref={containerRef} />

      <div style={{ margin: "1em 0", display: "flex", gap: "1em" }}>
        <button onClick={onPlayPause} style={{ minWidth: "5em" }}>
          {isPlaying ? "Pause" : "Play"}
        </button>
      </div>
    </>
  );
};
