export async function allEvents(client) {
  const out = [];
  let cursor = 0;
  while (cursor !== null) {
    const page = await client.list({ cursor });
    out.push(...page.data);
    cursor = page.nextCursor;
  }
  return out;
}
