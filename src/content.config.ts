import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";

const blog = defineCollection({
    loader: glob({ pattern: "**/**.md", base: "./src/content/blog/" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        //author: z.string(),
        created_at: z.date(),
        last_updated_at: z.date(),
        tags: z.array(z.string()),
    }),
});

export const collections = {
    blog: blog,
};
