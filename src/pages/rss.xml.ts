import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const essays = (await getCollection('essays', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
  );

  return rss({
    title: 'Agentic Developer Relations — Essays',
    description:
      'Long-form essays on Agentic Developer Relations, the discipline inside DevRel responsible for the AI agent layer of every developer platform. By Chris Woodruff.',
    site: context.site ?? 'https://agenticairelations.com',
    items: essays.map((essay) => ({
      title: essay.data.title,
      description: essay.data.description,
      pubDate: essay.data.publishDate,
      link: `/essays/${essay.slug}/`,
      categories: essay.data.tags,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: false,
  });
}
