import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    series: z
      .enum([
        'agentic-relations-introduction',
        'patterns',
        'roles',
        'measurement',
      ])
      .optional(),
    seriesOrder: z.number().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

export const collections = { essays };
