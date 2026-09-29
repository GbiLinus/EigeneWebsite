import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const localized = z.object({ de: z.string(), en: z.string() });

// Team: eine JSON-Datei pro Person in src/content/team/
const team = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/team' }),
  schema: z.object({
    name: z.string(),
    initials: z.string(),
    order: z.number(),
    role: localized,
    tone: z.enum(['sole', 'abend']),
    skills: z.array(localized),
    funFact: localized.optional(),
    email: z.string().optional(),
    photo: z.string().optional(),
  }),
});

// Projekte: eine Markdown-Datei pro Projekt und Sprache in
// src/content/projects/de/ und src/content/projects/en/.
// Dateien mit _ am Anfang werden ignoriert (Vorlage).
const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    place: z.string().optional(),
    year: z.number(),
    summary: z.string(),
    services: z.array(z.enum(['website', 'nfc', 'hosting'])),
    url: z.url().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

export const collections = { team, projects };
