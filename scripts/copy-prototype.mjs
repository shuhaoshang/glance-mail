import { cp } from 'node:fs/promises';

await cp(
  new URL('../docs/prototype/', import.meta.url),
  new URL('../dist/prototype/', import.meta.url),
  {
    recursive: true,
  },
);
