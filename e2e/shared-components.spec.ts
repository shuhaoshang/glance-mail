import { expect, test, type Page } from '@playwright/test';
import { tokenColor } from './helpers';

async function story(page: Page, id: string, theme: string) {
  const url = new URL('http://127.0.0.1:6196/iframe.html');
  url.searchParams.set('id', id);
  url.searchParams.set('viewMode', 'story');
  url.searchParams.set('globals', 'theme:' + theme);
  await page.goto(url.href);
  await expect
    .poll(() =>
      page.evaluate(() => {
        const preview = (
          window as unknown as {
            __STORYBOOK_PREVIEW__?: { currentRender?: { phase: string } };
          }
        ).__STORYBOOK_PREVIEW__;
        return preview?.currentRender?.phase ?? 'preparing';
      }),
    )
    .toMatch(/^(finished|errored)$/);
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __STORYBOOK_PREVIEW__: { currentRender: { phase: string } };
            }
          ).__STORYBOOK_PREVIEW__.currentRender.phase,
      ),
    )
    .toBe('finished');
}

test('Shared controls keep selection, keyboard focus, and touch targets', async ({
  page,
  colorScheme,
}) => {
  for (const size of ['default', 'small']) {
    await story(page, 'primitives-segmentedcontrol--' + size, colorScheme!);
    const selected = page.getByRole('tab', { name: 'Details' });
    const adjacent = page.getByRole('tab', { name: 'Original email' });
    const ink = await tokenColor(selected, '--color-ink');
    await expect(selected).toHaveCSS('background-color', ink);
    await expect(selected).toHaveCSS(
      'color',
      await tokenColor(selected, '--color-on-ink'),
    );
    await expect(selected).toHaveCSS('box-shadow', 'none');
    await selected.hover();
    await page.mouse.down();
    await expect(selected).toHaveCSS('background-color', ink);
    await page.mouse.up();
    await adjacent.hover();
    await expect(adjacent).toHaveCSS(
      'background-color',
      await tokenColor(adjacent, '--color-sunken-hover'),
    );
    await page.mouse.down();
    await expect(adjacent).toHaveCSS(
      'background-color',
      await tokenColor(adjacent, '--color-sunken-pressed'),
    );
    await page.mouse.up();
    await page.keyboard.press('Home');
    await expect(selected).toBeFocused();
    await adjacent.hover();
    await expect(selected).toHaveCSS('outline-style', 'solid');
    await expect(selected).toHaveCSS('z-index', '1');
    if (size === 'small') {
      for (const tab of await page.getByRole('tab').all()) {
        await expect(tab).toHaveCSS('height', '24px');
        const target = await tab.evaluate((el) => {
          const bounds = el.getBoundingClientRect();
          const extension = getComputedStyle(el, '::after');
          return {
            width:
              bounds.width -
              parseFloat(extension.left) -
              parseFloat(extension.right),
            height:
              bounds.height -
              parseFloat(extension.top) -
              parseFloat(extension.bottom),
          };
        });
        expect(target.width).toBeGreaterThanOrEqual(44);
        expect(target.height).toBeGreaterThanOrEqual(44);
      }
    }
    await story(
      page,
      'primitives-segmentedcontrol--' +
        (size === 'small' ? 'small-' : '') +
        'keyboard-navigation',
      colorScheme!,
    );
  }
});

test('Selected rows and fact chips match the shared visual states', async ({
  page,
  colorScheme,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await story(page, 'composites-briefrow--selected', colorScheme!);
    const row = page.getByRole('button', { name: /Fernway Logistics/ });
    const selected = await tokenColor(row, '--color-row-selected');
    await expect(row).toHaveCSS('background-color', selected);
    const shadow = await row.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toContain('inset');
    await row.hover();
    await expect(row).toHaveCSS('background-color', selected);
    await page.mouse.down();
    await expect(row).toHaveCSS('background-color', selected);
    await expect(row).toHaveCSS('box-shadow', shadow);
    await page.mouse.up();
    await expect(row.locator(':scope > svg')).toBeVisible();
    await expect(row.locator(':scope > svg')).toHaveCSS(
      'color',
      await tokenColor(row, '--color-brand'),
    );
    await expect(row.getByText('1', { exact: true })).toHaveCSS(
      'color',
      await tokenColor(row, '--color-brand-text'),
    );
  }
  for (const kind of ['money', 'time', 'people', 'urgent']) {
    await story(page, 'primitives-factchip--' + kind, colorScheme!);
    const chip = page.locator('#storybook-root > span');
    await expect(chip).toHaveCSS(
      'background-color',
      await tokenColor(
        chip,
        kind === 'urgent' ? '--color-urgent' : '--color-' + kind + '-tint',
      ),
    );
    await expect(chip).toHaveCSS(
      'color',
      await tokenColor(
        chip,
        kind === 'urgent' ? '--color-on-urgent' : '--color-' + kind + '-text',
      ),
    );
    await expect(chip.locator('[aria-hidden="true"]')).toHaveCount(
      kind === 'urgent' ? 1 : 0,
    );
  }
});

test('Reason labels, disclosure, and Watchlist callback remain usable', async ({
  page,
  colorScheme,
}) => {
  for (const id of [
    'primitives-reasonpill--eleven-items',
    'primitives-reasonpill--no-judgment',
    'primitives-reasonpill--toggle',
    'composites-reasonpanel--watchlist',
    'composites-detailpanel--escape-disclosures',
  ]) {
    await story(page, id, colorScheme!);
  }
});

test('Detail actions have one primary and keep the open menu state', async ({
  page,
  colorScheme,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await story(page, 'patterns-ask--phone-actions', colorScheme!);
    const open = page.getByRole('link', { name: 'Open in Yahoo Mail' });
    const footer = page.locator('footer').filter({ has: open });
    const snooze = footer.getByRole('button', { name: 'Snooze' });
    const done = footer.getByRole('button', { name: 'Done', exact: true });
    const primaryColor = await tokenColor(open, '--color-brand');
    async function onePrimary() {
      const colors = await footer
        .locator('button, a')
        .evaluateAll((els) =>
          els.map((el) => getComputedStyle(el).backgroundColor),
        );
      expect(colors.filter((color) => color === primaryColor)).toHaveLength(1);
    }
    await onePrimary();
    await expect(
      page.getByRole('button', { name: 'Ask', exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole('tab', { name: 'Ask', exact: true }),
    ).toBeVisible();
    for (const button of [snooze, done]) {
      await expect(button).toHaveCSS('height', width === 390 ? '44px' : '40px');
      await expect(button).toHaveCSS(
        'background-color',
        await tokenColor(button, '--color-surface'),
      );
    }
    if (width === 390) {
      const [primary, first, second] = await Promise.all([
        open.boundingBox(),
        snooze.boundingBox(),
        done.boundingBox(),
      ]);
      expect(first!.y).toBe(second!.y);
      expect(first!.width).toBeCloseTo(second!.width, 1);
      expect(primary!.y + primary!.height).toBeLessThan(first!.y);
      expect(primary!.width).toBeCloseTo(
        first!.width + second!.width + (second!.x - first!.x - first!.width),
        1,
      );
    }
    await snooze.click();
    await page.mouse.move(0, 0);
    await expect(snooze).toHaveCSS(
      'background-color',
      await tokenColor(snooze, '--color-sunken-pressed'),
    );
    await page.keyboard.press('Escape');
    await expect(snooze).toBeFocused();
    for (const checkbox of await page.getByRole('checkbox').all())
      await checkbox.check();
    const markDone = footer.getByRole('button', { name: 'Mark done' });
    await expect(markDone).toHaveCSS('background-color', primaryColor);
    await onePrimary();
    await expect(snooze).toHaveCount(0);
    await expect(open).toHaveCSS(
      'background-color',
      await tokenColor(open, '--color-surface'),
    );
    if (width === 390) {
      const [primary, secondary] = await Promise.all([
        markDone.boundingBox(),
        open.boundingBox(),
      ]);
      expect(primary!.width).toBeCloseTo(secondary!.width, 1);
      expect(primary!.y + primary!.height).toBeLessThan(secondary!.y);
      expect(secondary!.height).toBe(44);
    }
  }
});
