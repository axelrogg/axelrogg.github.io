// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from "@tailwindcss/vite";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyNotes from './rehype-pretty-notes.mjs';

import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  vite: {
      plugins: [tailwindcss()],
  },

  markdown: {
      rehypePlugins: [rehypeKatex, rehypePrettyNotes],
      remarkPlugins: [remarkMath],
  },

  integrations: [expressiveCode(
        {
            themes: ["ayu-dark"],
            styleOverrides: {
                frames: {
                    tooltipSuccessBackground: "#5d0ec0"
                }
            }
        }
    )]
});
