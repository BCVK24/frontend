import { Icon28ErrorCircleOutline, Icon28CheckCircleOutline } from "@vkontakte/icons"
import { Snackbar } from "@vkontakte/vkui"
import { FC } from "react"
import { iconNegative, iconPositive } from "../colors"

interface SnackBarProps {
  setSnackBar: React.Dispatch<React.SetStateAction<null | React.JSX.Element>>
  text: string
}

export const ErrorBar: FC<SnackBarProps> = ({setSnackBar, text}) => {
  return (
    <Snackbar
      onClose={() => setSnackBar(null)}
      before={<Icon28ErrorCircleOutline fill={iconNegative} />}
    >
      {text}
    </Snackbar>
  )
}

export const NotifyBar: FC<SnackBarProps> = ({setSnackBar, text}) => {
  return (
    <Snackbar
      onClose={() => setSnackBar(null)}
      before={<Icon28CheckCircleOutline fill={iconPositive} />}
    >
      {text}
    </Snackbar>
  )
}