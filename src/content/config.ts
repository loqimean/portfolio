import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    excerpt:  z.string(),
    category: z.string(),
    tags:     z.array(z.string()),
    pubDate:  z.coerce.date(),
    readTime: z.string(),
    draft:    z.boolean().optional(),
  }),
});

export const collections = { blog };
