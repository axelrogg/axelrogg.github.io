import type { CollectionEntry } from "astro:content";

export function getBlogCollectionPageParams(page: CollectionEntry<"blog">) {
    const [lang, ...slug] = page.id.split("/");
    const url = import.meta.env.DEV ? `${lang}/blog/${slug.join("/")}` : `blog/${slug.join("/")}`
    return {
        lang: lang,
        url: url,
    };
}
