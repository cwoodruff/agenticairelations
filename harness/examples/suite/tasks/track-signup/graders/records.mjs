import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { TallyClient } = await import(pathToFileURL(path.resolve('src/tally-sdk.mjs')));
const { trackSignup } = await import(pathToFileURL(path.resolve('src/track.mjs')));
const client = new TallyClient();
await trackSignup(client, 'u1');
const ok = client.events.length === 1 && client.events[0].name === 'signup' && client.events[0].properties.userId === 'u1';
process.exit(ok ? 0 : 1);
