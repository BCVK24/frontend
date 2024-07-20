import { useRouteNavigator } from "@vkontakte/vk-mini-apps-router";
import {
  FormItem,
  Input,
  ModalPage,
  ModalPageHeader,
  NavIdProps,
  FormLayoutGroup,
  Button,
  ButtonGroup,
  Div
} from "@vkontakte/vkui";
import { FC } from "react";
import { RecordingRel } from "../models/relschemas";
import { Tag } from "../models/schemas";
import { ErrorMessage } from "../components";
import { Normalize } from "../utils";
import { TagType2Text } from "../constants";
import { TagService } from "../services";
import { Region } from "wavesurfer.js/dist/plugins/regions.js";

interface AboutTagProps extends NavIdProps {
  currentRecording: RecordingRel | undefined;
  currentTag: Tag | undefined;
  currentRegion: Region | undefined;
  setCurrentTag: React.Dispatch<React.SetStateAction<Tag | undefined>>;
}

/**
 * @description Modal for DragNDroping files
 */
export const AboutTag: FC<AboutTagProps> = ({
  id,
  currentRecording,
  currentTag,
  currentRegion,
  setCurrentTag,
}) => {
  // Variables
  const router = useRouteNavigator();

  // Bad case
  if (!(currentRecording && currentTag)) {
    return (
      <ModalPage id={id} onClose={() => router.hideModal()}>
        <ErrorMessage
          header="Что-то пошло не так"
          subheader="Вы не должны этого видеть"
        />
      </ModalPage>
    );
  }

  // Buttons behavior
  const deleteTag = async () => {
    await TagService.delete(currentTag.id)
    currentRegion?.remove()
    router.hideModal()
  }

  const saveTag = async () => {
    await TagService.update(currentTag)
    currentRegion?.setOptions({content: currentTag.description})
    const tags = currentRecording.tags

    if (currentRegion)
      tags[+currentRegion.id].description = String(currentRegion?.content?.textContent) || ""

    router.hideModal()
  }

  const updateDescription = (e) => {
    setCurrentTag({...currentTag, description: e.target.value})
  }

  return (
    <ModalPage
      id={id}
      onClose={() => router.hideModal()}
      header={<ModalPageHeader>Об участке</ModalPageHeader>}
    >
      <FormItem top="Тип участка" htmlFor="start">
        {TagType2Text(currentTag.tag_type)}
      </FormItem>

      <FormItem top="Описание">
        <Input 
          value={currentTag.description} 
          onChange={updateDescription} 
        />
      </FormItem>

      <FormLayoutGroup mode="horizontal">
        <FormItem top="Начало" htmlFor="start">
          {Normalize(currentTag.start)}
        </FormItem>

        <FormItem top="Конец" htmlFor="end">
          {Normalize(currentTag.end)}
        </FormItem>
      </FormLayoutGroup>

      <Div>

        <ButtonGroup mode="horizontal" gap="m" stretched>
          <Button onClick={saveTag} size="l" appearance="positive" stretched>
            Сохранить
          </Button>
          <Button onClick={deleteTag} size="l" appearance="negative" stretched>
            Удалить
          </Button>
        </ButtonGroup>
      </Div>
    </ModalPage>
  );
};
