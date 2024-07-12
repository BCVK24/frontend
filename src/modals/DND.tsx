import { ModalPage, NavIdProps } from "@vkontakte/vkui";
import { FileUploader } from "react-drag-drop-files";
import { FC } from "react";
import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import { RecordingService } from "../services/recording";

const fileTypes = ["WAV"];

export const DND: FC<NavIdProps> = ({ id }) => {
  const router = useRouteNavigator();

  const handleChange = async (file) => {
    await RecordingService.create(file, new Date().toLocaleString("ru-RU"));
    router.hideModal();
  };

  return (
    <ModalPage id={id}>
      <FileUploader handleChange={handleChange} name="file" types={fileTypes} />
    </ModalPage>
  );
};
