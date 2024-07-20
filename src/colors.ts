export const TagType2Color = (tagType: string | undefined) => {
    switch (tagType) {
        case "MODELTAG": return "#FEC20733"
        case "USERTAG": return "#0277FF33"
        case "SOURCETAG": return "#E6464633" // Не отображается
        default: return "FFFFFF33"
    }
}

export const iconAccent = "var(--vkui--color_icon_accent)"
export const iconNegative = "var(--vkui--color_icon_negative)"
export const iconPositive = "var(--vkui--color_icon_positive)"