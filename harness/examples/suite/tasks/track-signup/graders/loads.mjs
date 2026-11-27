import { pathToFileURL } from 'node:url';
import path from 'node:path';
const mod = await import(pathToFileURL(path.resolve('src/track.mjs')));
if (typeof mod.trackSignup !== 'function') process.exit(1);
