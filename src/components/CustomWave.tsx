import { MutableRefObject, useMemo } from "react";
import { useWavesurfer } from "@wavesurfer/react";
import TimelinePlugin from "wavesurfer.js/dist/plugins/timeline.js";
import HoverPlugin from "wavesurfer.js/dist/plugins/hover.js";
import ZoomPlugin from "wavesurfer.js/dist/plugins/zoom.js";
import { SERVER_URL } from "../env";
import { RecordingRel } from "../models/relschemas";

/**
 * @description Custom hook that creates audio wave player
 */
export const useCustomWave = (
  wavesurferRef: MutableRefObject<null>,
  recording: RecordingRel | undefined,
) =>
  useWavesurfer({
    container: wavesurferRef,
    height: 100,
    barWidth: 2,
    barGap: 1,
    barRadius: 2,
    waveColor: "#001C3D",
    progressColor: "#E64646",
    url: recording && `${SERVER_URL}/${recording?.url}`,
    // peaks: recording?.soundwave
    //   ? [JSON.parse(recording?.soundwave)]
    //   : undefined,
    duration: recording?.duration,
    dragToSeek: true,
    plugins: useMemo(
      () => [
        TimelinePlugin.create(),
        HoverPlugin.create(),
        ZoomPlugin.create({
          scale: 0.5,
          maxZoom: 100,
        }),
      ],
      [],
    ),
  });
