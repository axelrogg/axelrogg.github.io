import type { SupportedLanguage } from "../i18n/ui";

export class DateUtils {
    private static days(language: SupportedLanguage) {
        const availableDays: { [lang in SupportedLanguage]: string[] } = {
            en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
        };
        return availableDays[language];
    }

    private static months(language: SupportedLanguage) {
        const availableMonths: { [lang in SupportedLanguage]: string[] } = {
            en: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            es: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ],
        };
        return availableMonths[language];
    }

    static readableDate(
        date: Date,
        language: SupportedLanguage = "en"
    ): string {
        const day = this.days(language)[date.getUTCDay()];
        const daynum = String(date.getUTCDate()).padStart(2, "0");
        const month = this.months(language)[date.getUTCMonth() - 1];
        const year = date.getUTCFullYear();

        if (language === "en") {
            return `${day} ${daynum}, ${month} ${year}`;
        }
        return `${day} ${daynum} de ${month.toLowerCase()} de ${year}`;
    }
}
