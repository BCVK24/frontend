import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { DropZone, ModalPage, NavIdProps, Placeholder, File, Div } from "@vkontakte/vkui";
import { FC, DragEvent, useEffect, useRef, useState, ChangeEvent } from "react";
import { POLLING_INTERVAL } from "../env";
import { RecordingService } from "../services";
import { RecordingRel, UserRel } from "../models/relschemas";
import { UserService } from "../services";
import { Icon56MusicOutline } from "@vkontakte/icons";
import { SnackBar } from "../components";
import React from "react";

interface DNDProps extends NavIdProps {
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  user: UserRel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserRel | undefined>>;
}

/**
 * @description Modal for DragNDroping files
 */
export const DND: FC<DNDProps> = ({ id, user, setUser }) => {
  const router = useRouteNavigator();
  const timerIdRef = useRef<number | undefined>();
  const [fetchingId, setFetchingId] = useState<number | undefined>(undefined);
  const [snackbar, setSnackbar] = useState<null | React.JSX.Element>(null);

  const Item = ({ active }) => (
    <Placeholder.Container>
      <Placeholder.Icon>
        <Icon56MusicOutline
          fill={active ? "var(--vkui--color_icon_accent)" : undefined}
        />
      </Placeholder.Icon>
      <Placeholder.Header>Перетащите сюда файл</Placeholder.Header>
      <Placeholder.Text>
        Чтобы загрузить аудио перетащите его сюда
        <Div>
          <File size="m" onChange={handleButtonChange}>
            Или нажмите сюда
          </File>
        </Div>
      </Placeholder.Text>
    </Placeholder.Container>
  );

  const handleChange = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    const recording =
      event.dataTransfer?.files.length && 
      (await RecordingService.create(
        event.dataTransfer.files[0],
        `Запись от ${new Date().toLocaleDateString("ru-RU")}`,
      ));

    const recordings = user?.recordings;
    recordings && recording && recordings.push(recording);

    if (!recording || recording == undefined) {
      setSnackbar(<SnackBar setSnackBar={setSnackbar} text="Убедитесь, что вы загрузили корректный wav файл" />)
    }

    router.hideModal();

    recording && setFetchingId(recording.id);
  };

  const handleButtonChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const recording =
      event?.target?.files?.length &&
      (await RecordingService.create(
        event.target.files[0],
        `Запись от ${new Date().toLocaleDateString("ru-RU")}`,
      ));

    const recordings = user?.recordings;
    recordings && recording && recordings.push(recording);

    if (recording)
      router.hideModal();
    else
      setSnackbar(<SnackBar setSnackBar={setSnackbar} text="Убедитесь, что вы загрузили корректный wav файл" />)


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
      {snackbar}
    </ModalPage>
  );
};
