import { getCollection } from 'astro:content';

/**
 * Essays that are not drafts and whose publish date has arrived, newest
 * first. The date is checked at build time, so a scheduled essay appears on
 * the first build on or after its date (the deploy workflow rebuilds daily).
 */
export async function publishedEssays() {
  const now = Date.now();
  const essays = await getCollection(
    'essays',
    ({ data }) => !data.draft && data.publishDate.valueOf() <= now,
  );
  return essays.sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}
