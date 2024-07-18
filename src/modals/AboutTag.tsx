import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  FormItem,
  Input,
  ModalPage,
  ModalPageHeader,
  NavIdProps,
  Slider,
} from "@vkontakte/vkui";
import { FC } from "react";
import { RecordingRel } from "../models/relschemas";
import { Tag } from "../models/schemas";
import { ErrorMessage } from "../components/ErrorMessage";

interface AboutTagProps extends NavIdProps {
  recording: RecordingRel | undefined;
  setRecording: React.Dispatch<React.SetStateAction<RecordingRel | undefined>>;
  currentTag: Tag | undefined;
  setCurrentTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
}

/**
 * @description Modal for DragNDroping files
 */
export const AboutTag: FC<AboutTagProps> = ({
  id,
  recording,
  setRecording,
  currentTag,
  setCurrentTag,
}) => {
  const router = useRouteNavigator();

  if (!(recording && currentTag)) {
    return (
      <ModalPage id={id} onClose={() => router.hideModal()}>
        <ErrorMessage
          header="Что-то пошло не так"
          subheader="Вы не должны этого видеть"
        />
      </ModalPage>
    );
  }

  return (
    <ModalPage
      id={id}
      onClose={() => router.hideModal()}
      header={<ModalPageHeader>Об участке</ModalPageHeader>}
    >
      <FormItem top="Описание">
        <Input value={currentTag.description} />
      </FormItem>

      <FormItem top="Имя" htmlFor="start">
        {currentTag.start}
      </FormItem>

      <FormItem top="Имя" htmlFor="end">
        {currentTag.end}
      </FormItem>

      {currentTag.tag_type}
      {currentTag.start}
      {currentTag.end}
    </ModalPage>
  );
};
