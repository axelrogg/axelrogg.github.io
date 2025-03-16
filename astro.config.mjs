// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from './rehype-pretty-code.mjs';
import rehypePrettyNotes from './rehype-pretty-notes.mjs';

export default defineConfig({
    vite: {
        plugins: [tailwindcss()],
    },
    markdown: {
        rehypePlugins: [rehypeKatex, rehypePrettyNotes, rehypePrettyCode],
        remarkPlugins: [remarkMath],
        shikiConfig: {
            theme: "ayu-dark",
        }
    }
});
