export const TagType2Text = (tagType: string | undefined) => {
    switch (tagType) {
        case "MODELTAG": return "Создан моделью"
        case "USERTAG": return "Добавлен пользователем"
        case "SOURCETAG": return "Исходный тег" // Не отображается
        default: return "Неизвестный тег"
    }
}