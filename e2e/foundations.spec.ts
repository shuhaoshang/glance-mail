import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const source = readFileSync(
  new URL('../src/design-system/tokens/tokens.css', import.meta.url),
  'utf8',
);
const expected = [
  ...new Set(
    Array.from(source.matchAll(/(--[\w-]+)\s*:/g), (match) => match[1]),
  ),
].sort();
const pages = ['Colors', 'Radius', 'Type', 'Spacing', 'Motion'];

test('Foundations lists every supplied token', async ({
  page,
  colorScheme,
}) => {
  const listed = new Set<string>();
  for (const name of pages) {
    await test.step(name, async () => {
      const url = new URL('http://127.0.0.1:6196/iframe.html');
      url.searchParams.set(
        'id',
        'foundations-' + name.toLowerCase() + '--default',
      );
      url.searchParams.set('viewMode', 'story');
      url.searchParams.set('globals', 'theme:' + colorScheme);
      await page.goto(url.href);
      const catalog = page.getByRole('main');
      await expect(
        catalog.getByRole('heading', { name, exact: true, level: 1 }),
      ).toBeVisible();
      await expect(page.locator('body')).toHaveCSS(
        'background-image',
        /radial-gradient/,
      );
      for (const value of await catalog.locator('code').allTextContents()) {
        if (/^--[\w-]+$/.test(value)) listed.add(value);
      }
    });
  }
  expect([...listed].sort()).toEqual(expected);
});
