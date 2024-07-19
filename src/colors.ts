export const TagType2Color = (tagType: string | undefined) => {
    switch (tagType) {
        case "MODELTAG": return "#FEC20733"
        case "USERTAG": return "#0277FF33"
        case "SOURCETAG": return "#E6464633" // Не отображается
        default: return "FFFFFF33"
    }
}