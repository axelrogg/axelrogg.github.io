import { localizedUI, type SupportedLanguage } from "./ui";

export function useTranslations(language: SupportedLanguage) {
    return localizedUI[language];
}
