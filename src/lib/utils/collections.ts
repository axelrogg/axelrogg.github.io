import type { CollectionEntry } from "astro:content";

export function getBlogCollectionPageParams(page: CollectionEntry<"blog">) {
    const [lang, ...slug] = page.id.split("/");
    return {
        lang: lang,
        url: `${lang}/blog/${slug.join("/")}`,
    };
}
