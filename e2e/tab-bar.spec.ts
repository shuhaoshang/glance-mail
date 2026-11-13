import { expect, test, type Page, type Locator } from '@playwright/test';

async function story(page: Page, name: string, theme: string) {
  const url = new URL('http://127.0.0.1:6196/iframe.html');
  url.searchParams.set('id', name);
  url.searchParams.set('viewMode', 'story');
  url.searchParams.set('globals', 'theme:' + theme);
  await page.goto(url.href);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const render = (
          window as unknown as {
            __STORYBOOK_PREVIEW__?: {
              currentRender?: { phase: string; playFunctionException?: Error };
            };
          }
        ).__STORYBOOK_PREVIEW__?.currentRender;
        return render?.playFunctionException?.message ?? render?.phase;
      }),
    )
    .toBe('finished');
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
}

async function token(
  element: Locator,
  name: string,
  property: 'color' | 'backgroundColor' | 'boxShadow',
) {
  return element.evaluate(
    (el, { name, property }) => {
      const probe = document.createElement('span');
      probe.style[property] = 'var(' + name + ')';
      el.append(probe);
      const value = getComputedStyle(probe)[property];
      probe.remove();
      return value;
    },
    { name, property },
  );
}

async function targetAtLeast44(element: Locator) {
  const target = await element.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const extension = getComputedStyle(el, '::after');
    return {
      width:
        rect.width - parseFloat(extension.left) - parseFloat(extension.right),
      height:
        rect.height - parseFloat(extension.top) - parseFloat(extension.bottom),
    };
  });
  expect(target.width).toBeGreaterThanOrEqual(44);
  expect(target.height).toBeGreaterThanOrEqual(44);
}

test('TabBar groups, panel relationships, and keyboard selection', async ({
  page,
  colorScheme,
}) => {
  for (const id of [
    'keyboard-navigation',
    'selection-and-news',
    'left-group-only',
  ]) {
    await story(page, 'primitives-tabbar--' + id, colorScheme!);
  }
  await expect(page.getByRole('tablist', { name: 'Glance' })).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(3);
  await story(page, 'primitives-tabbar--needs-you', colorScheme!);
  const email = page.getByRole('tablist', { name: 'Email' });
  const glance = page.getByRole('tablist', { name: 'Glance' });
  await expect(email).toBeVisible();
  await expect(glance).toBeVisible();
  await expect(page.getByRole('tab')).toHaveCount(5);
  const selected = email.getByRole('tab', { selected: true });
  const fill = await token(selected, '--color-ink', 'backgroundColor');
  const shadow = await token(selected, '--shadow-tab-selected', 'boxShadow');
  await expect(selected).toHaveCSS('background-color', fill);
  await expect(selected).toHaveCSS('box-shadow', shadow);
  await expect(selected.getByText('3', { exact: true })).toHaveCSS(
    'color',
    await token(selected, '--color-on-ink-muted', 'color'),
  );
  await selected.hover();
  await page.mouse.down();
  await expect(selected).toHaveCSS('background-color', fill);
  await expect(selected).toHaveCSS('box-shadow', shadow);
  await page.mouse.up();
  const unselected = email.getByRole('tab', { name: 'Heads-up 3' });
  const hover = await token(
    unselected,
    '--color-glass-hover',
    'backgroundColor',
  );
  await unselected.hover();
  await expect(unselected).toHaveCSS('background-color', hover);
  await page.mouse.down();
  await expect(unselected).toHaveCSS('background-color', hover);
  await page.mouse.up();
  await expect(unselected).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(selected).toBeFocused();
  await unselected.hover();
  await expect(selected).toHaveCSS('outline-style', 'solid');
  await expect(selected).toHaveCSS('z-index', '1');
  const watch = glance.getByRole('tab', { name: 'Watchlist 8, new' });
  const dot = watch.locator('[aria-hidden="true"]');
  await expect(dot).toHaveCSS('width', '8px');
  await expect(dot).toHaveCSS('top', '4px');
  await expect(dot).toHaveCSS('inset-inline-end', '4px');
  await expect(dot).toHaveCSS(
    'background-color',
    await token(watch, '--color-brand', 'backgroundColor'),
  );
  await watch.click();
  await expect(dot).toHaveCSS(
    'background-color',
    await token(watch, '--color-on-ink', 'backgroundColor'),
  );
  const countBounds = await watch.getByText('8', { exact: true }).boundingBox();
  const dotBounds = await dot.boundingBox();
  expect(dotBounds!.x - countBounds!.x - countBounds!.width).toBeCloseTo(4, 1);
  for (const tab of await page.getByRole('tab').all())
    await targetAtLeast44(tab);
});

test('Phone tabs fit with counts and header buttons remain accessible', async ({
  page,
  colorScheme,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'primitives-tabbar--phone-keyboard', colorScheme!);
  await expect(page.getByRole('tablist', { name: 'Glance' })).toHaveCount(0);
  const group = page.getByRole('tablist', { name: 'Email' });
  const tabs = group.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  const widths: number[] = [];
  for (const name of ['Needs you 3', 'Heads-up 3', 'Other mail 31']) {
    const tab = group.getByRole('tab', { name });
    await expect(tab).toHaveCSS('font-size', '12px');
    await expect(tab).toHaveCSS('height', '40px');
    const metrics = await tab.evaluate((el) => {
      const bounds = el.getBoundingClientRect();
      const spans = Array.from(el.children).map((child) =>
        child.getBoundingClientRect(),
      );
      return {
        width: bounds.width,
        fits: el.scrollWidth <= el.clientWidth,
        tops: spans.map((r) => r.top),
        inside: spans.every(
          (r) => r.left >= bounds.left && r.right <= bounds.right,
        ),
      };
    });
    expect(metrics.fits).toBe(true);
    expect(metrics.inside).toBe(true);
    expect(new Set(metrics.tops).size).toBe(1);
    widths.push(metrics.width);
    await targetAtLeast44(tab);
  }
  expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(1);
  expect((await group.boundingBox())!.width).toBe(358);
  const watch = page.getByRole('button', { name: 'Watchlist, new' });
  await expect(watch).toHaveCSS('width', '40px');
  await expect(watch).toHaveCSS('height', '40px');
  await targetAtLeast44(watch);
  const icon = watch.locator('svg');
  const dot = watch.locator('span[aria-hidden="true"]');
  await expect(icon).toHaveCSS('width', '20px');
  await expect(icon).toHaveCSS('height', '20px');
  const brand = await token(watch, '--color-brand', 'color');
  const hover = await token(watch, '--color-glass-hover', 'backgroundColor');
  await expect(icon).toHaveCSS('color', brand);
  await expect(dot).toHaveCSS('top', '4px');
  await expect(dot).toHaveCSS('inset-inline-end', '4px');
  await watch.hover();
  await expect(watch).toHaveCSS('background-color', hover);
  await expect(icon).toHaveCSS('color', brand);
  await page.mouse.down();
  await expect(watch).toHaveCSS('background-color', hover);
  await expect(icon).toHaveCSS('color', brand);
  // Release away from the control so the keyboard test still starts unselected.
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await expect(watch).toHaveAttribute('aria-pressed', 'false');
  await watch.focus();
  await page.keyboard.press('Enter');
  await expect(watch).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByRole('region', { name: 'Watchlist', exact: true }),
  ).toBeVisible();
  await expect(watch).toHaveCSS(
    'background-color',
    await token(watch, '--color-ink', 'backgroundColor'),
  );
  await expect(watch.locator('[aria-hidden="true"]').last()).toHaveCSS(
    'background-color',
    await token(watch, '--color-on-ink', 'backgroundColor'),
  );
  const ink = await token(watch, '--color-ink', 'backgroundColor');
  const onInk = await token(watch, '--color-on-ink', 'color');
  const shadow = await watch.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(shadow).toContain(
    await token(watch, '--shadow-tab-selected', 'boxShadow'),
  );
  await expect(icon).toHaveCSS('color', onInk);
  await watch.hover();
  await expect(watch).toHaveCSS('background-color', ink);
  await expect(watch).toHaveCSS('box-shadow', shadow);
  await page.mouse.down();
  await expect(watch).toHaveCSS('background-color', ink);
  await expect(icon).toHaveCSS('color', onInk);
  await expect(watch).toHaveCSS('box-shadow', shadow);
  await page.mouse.up();
  await page.keyboard.press('Tab');
  const memory = page.getByRole('button', { name: 'Memory', exact: true });
  await expect(memory).toBeFocused();
  await page.keyboard.press('Space');
  await expect(memory).toHaveAttribute('aria-pressed', 'true');
  await expect(watch).toHaveAttribute('aria-pressed', 'false');
  await expect(
    page.getByRole('region', { name: 'Memory', exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(390);
});
