import { ModalCardBase, ModalCardBaseProps, Div, Flex } from "@vkontakte/vkui";
import { Icon56ErrorOutline } from "@vkontakte/icons";
import { FC } from "react";

interface ErrorMessageProps extends ModalCardBaseProps {}

/**
 * @description Modal card for showing error messages
 */
export const ErrorMessage: FC<ErrorMessageProps> = ({ header, subheader }) => {
  return (
    <Flex align="center" justify="center">
      <Div>
        <ModalCardBase
          style={{ width: 450, marginBottom: 20 }}
          header={header}
          subheader={subheader}
          icon={<Icon56ErrorOutline />}
          dismissButtonMode="none"
        />
      </Div>
    </Flex>
  );
};
