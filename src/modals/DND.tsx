import React, { FC, DragEvent, useState, ChangeEvent } from "react";
import { DropZone, ModalPage, NavIdProps, Placeholder, File, Div } from "@vkontakte/vkui";
import { Icon56MusicOutline } from "@vkontakte/icons";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { RecordingService } from "../services";
import { UserRel } from "../models/relschemas";
import { ErrorBar } from "../components";
import { iconAccent } from "../colors";

interface DNDProps extends NavIdProps {
  currentUser: UserRel | undefined;
  setFetchRecordings: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @description Modal for DragNDroping files
 */
export const DND: FC<DNDProps> = ({ id, currentUser, setFetchRecordings }) => {
  const router = useRouteNavigator();
  const [snackbar, setSnackbar] = useState<null | React.JSX.Element>(null);

  // Template
  const Item = ({ active }) => (
    <Placeholder.Container>
      <Placeholder.Icon>
        <Icon56MusicOutline
          fill={active ? iconAccent : undefined}
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

  // Handle D&D event 
  const handleChange = async (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    const recording =
      event.dataTransfer?.files.length && 
      (await RecordingService.create(
        event.dataTransfer.files[0],
        `Запись от ${new Date().toLocaleDateString("ru-RU")}`,
      ));

    const recordings = currentUser?.recordings;
    recordings && recording && recordings.push(recording);

    if (!recording || recording == undefined) {
      setSnackbar(<ErrorBar setSnackBar={setSnackbar} text="Убедитесь, что вы загрузили корректный wav файл" />)
    }

    router.hideModal();

    recording && setFetchRecordings(true);
  };

  // Handle button event
  const handleButtonChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const recording =
      event?.target?.files?.length &&
      (await RecordingService.create(
        event.target.files[0],
        `Запись от ${new Date().toLocaleDateString("ru-RU")}`,
      ));

    const recordings = currentUser?.recordings;
    recordings && recording && recordings.push(recording);

    if (recording)
      router.hideModal();
    else
      setSnackbar(<ErrorBar setSnackBar={setSnackbar} text="Убедитесь, что вы загрузили корректный wav файл" />)

    recording && setFetchRecordings(true);
  };

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
