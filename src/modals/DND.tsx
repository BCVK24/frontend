import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { DropZone, ModalPage, NavIdProps, Placeholder } from "@vkontakte/vkui";
import { FC, DragEvent, useEffect, useRef, useState } from "react";
import { POLLING_INTERVAL } from "../env";
import { RecordingService } from "../services";
import { RecordingRel, UserRel } from "../models/relschemas";
import { UserService } from "../services";
import { Icon56MusicOutline } from "@vkontakte/icons";

interface DNDProps extends NavIdProps {
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  user: UserRel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
}

const Item = ({ active }) => (
  <Placeholder.Container>
    <Placeholder.Icon>
      <Icon56MusicOutline
        fill={active ? "var(--vkui--color_icon_accent)" : undefined}
      />
    </Placeholder.Icon>
    <Placeholder.Header>Быстрая отправка</Placeholder.Header>
    <Placeholder.Text>
      Перенесите файл сюда для быстрой отправки. В таком случае изображения
      будут сжаты.
    </Placeholder.Text>
  </Placeholder.Container>
);

/**
 * @description Modal for DragNDroping files
 */
export const DND: FC<DNDProps> = ({ id, user, setUser }) => {
  const router = useRouteNavigator();
  const timerIdRef = useRef<number | undefined>();
  const [fetchingId, setFetchingId] = useState<number | undefined>(undefined);

  const handleChange = async (event: DragEvent<HTMLElement>) => {
    console.log(event.dataTransfer?.files.length);
    event.preventDefault();
    console.log("PUSHING");
    const recording =
      event.dataTransfer?.files.length &&
      (await RecordingService.create(
        event.dataTransfer.files[0],
        new Date().toLocaleString("ru-RU"),
      ));
    console.log("PUSHED");

    const recordings = user?.recordings;
    recordings && recording && recordings.push(recording);
    router.hideModal();

    recording && setFetchingId(recording.id);
  };

  useEffect(() => {
    const pollingCallback = async () => {
      const recording = fetchingId
        ? await RecordingService.get_info(fetchingId)
        : undefined;

      if (!recording?.processing) {
        setUser(await UserService.get_current());
        setFetchingId(undefined);
        stopPolling();
      }
    };

    const startPolling = () => {
      timerIdRef.current = setInterval(pollingCallback, POLLING_INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (fetchingId) {
      startPolling();
    } else {
      stopPolling();
    }
  }, [fetchingId]);

  return (
    <ModalPage id={id}>
      <DropZone.Grid>
        <DropZone
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={handleChange}
        >
          {({ active }) => <Item active={active} />}
        </DropZone>
      </DropZone.Grid>
    </ModalPage>
  );
};
