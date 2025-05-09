export type SupportedLanguage = "en" | "es";

type BlogSectionLabels = {
    postsListPageTitle: string;
    firstPublished: string;
    lastUpdated: string;
};

export type UILocalization = {
    blog: BlogSectionLabels;
};

export type LocalizedUI = {
    [lang in SupportedLanguage]: UILocalization;
};

export const localizedUI: LocalizedUI = {
    en: {
        blog: {
            postsListPageTitle: "Posts",
            firstPublished: "First Published",
            lastUpdated: "Last updated",
        },
    },
    es: {
        blog: {
            postsListPageTitle: "Publicaciones",
            firstPublished: "Publicado por primera vez",
            lastUpdated: "Actualizado por última vez",
        },
    },
} as const;
