import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { TallyClient } = await import(pathToFileURL(path.resolve('src/tally-sdk.mjs')));
const { allEvents } = await import(pathToFileURL(path.resolve('src/export.mjs')));
const client = new TallyClient({ pageSize: 2 });
for (let i = 0; i < 5; i++) await client.record(`e${i}`);
const events = await allEvents(client);
const ok = Array.isArray(events) && events.length === 5 && events.every((e, i) => e.name === `e${i}`);
process.exit(ok ? 0 : 1);
