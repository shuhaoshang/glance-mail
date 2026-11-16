import { test, expect, type Page } from '@playwright/test';
import maya from '../src/data/maya.json' with { type: 'json' };
import daniel from '../src/data/daniel.json' with { type: 'json' };
import sarah from '../src/data/sarah.json' with { type: 'json' };
import { cleanStart, detail, exact, row } from './helpers';

function navigation(page: Page) {
  return page
    .getByRole('tab', { name: /^Watchlist/ })
    .or(page.getByRole('button', { name: /^Watchlist(?:, new)?$/ }));
}
async function openWatch(page: Page) {
  if (await page.getByRole('dialog').count()) {
    await detail(page).getByRole('button', exact('Close detail')).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
  await navigation(page).click();
  await expect(page.getByRole('heading', exact('Watchlist'))).toBeVisible();
}
async function back(page: Page, width: number) {
  if (width === 390)
    await page.getByRole('button', exact('Back to brief')).click();
  else await page.getByRole('tab', { name: /^Needs you / }).click();
}
const topics = (page: Page) =>
  page.getByRole('list', exact('Watchlist topics'));
const undo = (page: Page) => page.getByRole('button', exact('Undo'));
test('Watchlist counts, news links, phone navigation, and long names match each persona', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const persona of [maya, daniel, sarah]) {
      await cleanStart(page, persona.id);
      await openWatch(page);
      await expect(topics(page).getByRole('listitem')).toHaveCount(
        persona.watchlist.length,
      );
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(navigation(page)).toHaveAttribute('aria-label', /, new$/);
      for (const topic of persona.watchlist) {
        const item = topics(page).locator('[data-watch-id="' + topic.id + '"]');
        const name = item.getByText(topic.name, { exact: true });
        const rename = item.getByRole('button', exact('Rename ' + topic.name));
        const [nameBox, renameBox] = await Promise.all([
          name.boundingBox(),
          rename.boundingBox(),
        ]);
        expect(nameBox!.x + nameBox!.width).toBeLessThanOrEqual(renameBox!.x);
      }
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
      for (const topic of persona.watchlist.filter((item) => item.news > 0)) {
        await topics(page)
          .getByRole('button', exact(topic.news + ' new for ' + topic.name))
          .click();
        const item = persona.items.find((item) => item.id === topic.item);
        const heads = persona.goodToKnow.find((item) => item.id === topic.item);
        await expect(
          detail(page).getByRole('heading', exact(item?.name ?? heads!.title)),
        ).toBeVisible();
        await expect(
          page.getByRole('tab', {
            name: new RegExp('^' + (item ? 'Needs you' : 'Heads-up') + ' '),
          }),
        ).toHaveAttribute('aria-selected', 'true');
        if (width === 390) await expect(page.getByRole('dialog')).toBeVisible();
        await openWatch(page);
      }
      await back(page, width);
      await expect(
        page.getByRole('heading', exact(persona.greeting)),
      ).toBeVisible();
    }
  }
});
test('Add, rename, remove, and Undo preserve order and focus and reject blank input', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    await openWatch(page);
    await expect(topics(page).getByRole('listitem')).toHaveCount(8);
    await expect(
      topics(page).getByRole('button', { name: /^2 new for / }),
    ).toHaveCount(1);
    await expect(
      topics(page).getByRole('button', { name: /^1 new for / }),
    ).toHaveCount(2);
    await expect(
      topics(page).getByText('Nothing new', { exact: true }),
    ).toHaveCount(5);
    const add = page.locator('[data-watch-add]');
    const original = await topics(page)
      .locator('[data-watch-id]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('data-watch-id')),
      );
    await add.click();
    const input = page.getByRole('textbox', exact('Add a Watchlist topic'));
    const form = page.getByRole('form', exact('Add a Watchlist topic'));
    await expect(input).toBeFocused();
    await input.fill('   ');
    await expect(form.getByRole('button', exact('Add'))).toBeDisabled();
    await input.press('Escape');
    await expect(add).toBeFocused();
    await add.click();
    await form.getByRole('button', exact('Cancel')).click();
    await expect(form).toHaveCount(0);
    await expect(add).toBeFocused();
    await add.click();
    await input.fill('Okto renewal');
    await input.press('Enter');
    await expect(add).toBeFocused();
    await expect(topics(page).getByRole('listitem')).toHaveCount(9);
    if (width !== 390)
      await expect(
        page.getByRole('tab', { name: /^Watchlist 9/ }),
      ).toBeVisible();
    await expect(topics(page).getByRole('listitem').first()).toContainText(
      'Okto renewal',
    );
    await expect(topics(page).getByRole('listitem').first()).toContainText(
      'Nothing yet',
    );
    await expect(
      page.getByText('Added to Watchlist.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Emails about it will go to the top.', { exact: true }),
    ).toBeVisible();
    await undo(page).click();
    await expect(topics(page).getByRole('listitem')).toHaveCount(8);
    await expect(add).toBeFocused();

    await page.getByRole('button', exact('Rename Fernway renewal')).click();
    const renameInput = page.getByRole(
      'textbox',
      exact('Rename Fernway renewal'),
    );
    await expect(renameInput).toBeFocused();
    await renameInput.fill(' ');
    await expect(page.getByRole('button', exact('Save'))).toBeDisabled();
    await renameInput.press('Escape');
    await expect(
      page.getByRole('button', exact('Rename Fernway renewal')),
    ).toBeFocused();
    await page.getByRole('button', exact('Rename Fernway renewal')).click();
    await renameInput.fill('Fernway renewal follow-up');
    await renameInput.press('Enter');
    await expect(
      page.getByRole('button', exact('Rename Fernway renewal follow-up')),
    ).toBeFocused();
    await expect(page.getByText('Saved.', { exact: true })).toBeVisible();
    await undo(page).click();
    await expect(
      page.getByRole('button', exact('Rename Fernway renewal')),
    ).toBeFocused();
    await expect(topics(page).locator('[data-watch-id]')).toHaveCount(
      original.length,
    );

    await page.getByRole('button', exact('Remove Halden Health deal')).click();
    await expect(
      page.getByRole('button', exact('Rename Corvo Retail QBR')),
    ).toBeFocused();
    await expect(topics(page).getByRole('listitem')).toHaveCount(7);
    await undo(page).click();
    await expect(
      page.getByRole('button', exact('Rename Halden Health deal')),
    ).toBeFocused();
    expect(
      await topics(page)
        .locator('[data-watch-id]')
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute('data-watch-id')),
        ),
    ).toEqual(original);

    for (const topic of maya.watchlist.filter((item) => item.news > 0))
      await page.getByRole('button', exact('Remove ' + topic.name)).click();
    await expect(navigation(page)).not.toHaveAttribute('aria-label', /, new$/);
    await undo(page).click();
    await expect(navigation(page)).toHaveAttribute('aria-label', /, new$/);
    while (await topics(page).count())
      await topics(page)
        .getByRole('button', { name: /^Remove / })
        .first()
        .click();
    await expect(
      page.getByText('Nothing on your Watchlist.', { exact: true }),
    ).toBeVisible();
    await expect(add).toBeFocused();
    await undo(page).click();
    await expect(topics(page).getByRole('listitem')).toHaveCount(1);
  }
});
test('Attribution follows renames, removal, Undo, and the current location of moved mail', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    await openWatch(page);
    await page.getByRole('button', exact('Rename Fernway renewal')).click();
    await page.getByRole('textbox').fill('Fernway follow-up');
    await page.getByRole('textbox').press('Enter');
    await back(page, width);
    await row(page, 'Fernway Logistics').click();
    await detail(page)
      .getByRole('button', { name: /^Why it’s first:/ })
      .click();
    await detail(page)
      .getByRole('button', exact('Watchlist: Fernway follow-up'))
      .click();
    await expect(page.getByRole('heading', exact('Watchlist'))).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', exact('Remove Fernway follow-up')).click();
    await back(page, width);
    await row(page, 'Fernway Logistics').click();
    await expect(
      detail(page).getByRole('button', { name: /^Watchlist:/ }),
    ).toHaveCount(0);
    await undo(page).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('button', exact('Rename Fernway follow-up')),
    ).toBeFocused();
    await page
      .getByRole('button', exact('2 new for Fernway follow-up'))
      .click();
    await detail(page).getByRole('button', exact('Move to')).click();
    await page.getByRole('menuitem', { name: /^Other mail / }).click();
    await expect(page.getByRole('button', exact('Undo'))).toBeVisible();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await openWatch(page);
    await page
      .getByRole('button', exact('2 new for Fernway follow-up'))
      .click();
    await expect(page.getByRole('tab', exact('Other mail 32'))).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      detail(page).getByRole('heading', exact('Fernway Logistics')),
    ).toBeVisible();
  }
});
test('Watchlist edits keep ranking unchanged and reset with the persona', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  const order = () =>
    page
      .locator('[role="list"][aria-label="Needs you"] [data-brief-item]')
      .evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('data-brief-item')),
      );
  const before = await order();
  await openWatch(page);
  await page.locator('[data-watch-add]').click();
  await page.getByRole('textbox').fill('Okto renewal');
  await page.getByRole('textbox').press('Enter');
  expect(await order()).toEqual(before);
  await page.getByRole('button', exact('2 Formatted')).click();
  await page.getByRole('button', exact('3 Glance')).click();
  await expect(page.getByRole('tab', { name: /^Watchlist 9/ })).toBeVisible();
  await page.getByRole('button', exact('Daniel · Manager')).click();
  await page.getByRole('button', exact('Maya · Sales')).click();
  await openWatch(page);
  await expect(topics(page).getByRole('listitem')).toHaveCount(8);
  await expect(
    page.getByRole('button', exact('Rename Okto renewal')),
  ).toHaveCount(0);
});
