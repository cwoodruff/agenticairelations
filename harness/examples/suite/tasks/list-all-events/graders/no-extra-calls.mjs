import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { TallyClient } = await import(pathToFileURL(path.resolve('src/tally-sdk.mjs')));
const { allEvents } = await import(pathToFileURL(path.resolve('src/export.mjs')));
const client = new TallyClient({ pageSize: 2 });
for (let i = 0; i < 5; i++) await client.record(`e${i}`);
await allEvents(client);
process.exit(client.calls.filter((c) => c.method === 'list').length === 3 ? 0 : 1);
