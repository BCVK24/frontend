import { Icon28ErrorCircleOutline, Icon28, Icon28CheckCircleOutline } from "@vkontakte/icons"
import { Snackbar } from "@vkontakte/vkui"
import { FC } from "react"

interface SnakcBarProps {
    setSnackBar: React.Dispatch<React.SetStateAction<null | React.JSX.Element>>
    text: string
}

export const SnackBar: FC<SnakcBarProps> = ({setSnackBar, text}) => {
    return (

    <Snackbar
        onClose={() => setSnackBar(null)}
        before={<Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />}
    >
        {text}
    </Snackbar>
    )
}

export const NotifyBar: FC<SnakcBarProps> = ({setSnackBar, text}) => {
    return (

    <Snackbar
        onClose={() => setSnackBar(null)}
        before={<Icon28CheckCircleOutline fill="var(--vkui--color_icon_positive)" />}
    >
        {text}
    </Snackbar>
    )
}