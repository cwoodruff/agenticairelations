import { pathToFileURL } from 'node:url';
import path from 'node:path';
const { TallyClient } = await import(pathToFileURL(path.resolve('src/tally-sdk.mjs')));
const { trackSignup } = await import(pathToFileURL(path.resolve('src/track.mjs')));
const client = new TallyClient();
await trackSignup(client, 'u1');
await trackSignup(client, 'u1');
await trackSignup(client, 'u2');
process.exit(client.events.length === 2 ? 0 : 1);
