import { pathToFileURL } from 'node:url';
import path from 'node:path';
const mod = await import(pathToFileURL(path.resolve('src/export.mjs')));
if (typeof mod.allEvents !== 'function') process.exit(1);
