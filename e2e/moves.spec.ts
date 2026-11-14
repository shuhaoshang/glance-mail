import { test, expect, type Page } from '@playwright/test';
import maya from '../src/data/maya.json' with { type: 'json' };
import { cleanStart, detail, exact } from './helpers';
const tabs = ['Needs you', 'Heads-up', 'Other mail'] as const;
type Tab = (typeof tabs)[number];
function mailRow(page: Page, tab: Tab, id: string) {
  return page
    .locator('[role="list"][aria-label="' + tab + '"]')
    .locator('[data-brief-item="' + id + '"], [data-mail-item="' + id + '"]');
}
async function pick(page: Page, tab: Tab, id: string) {
  if (await page.getByRole('dialog').count()) {
    await detail(page).getByRole('button', exact('Close detail')).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
  }
  await page
    .getByRole('tablist', exact('Email'))
    .getByRole('tab', { name: new RegExp('^' + tab + ' ') })
    .click();
  await mailRow(page, tab, id).click();
}
async function move(page: Page, to: Tab) {
  await detail(page).getByRole('button', exact('Move to')).click();
  await page
    .getByRole('menu', exact('Move to'))
    .getByRole('menuitem', { name: new RegExp('^' + to + ' ') })
    .click();
  await expect(
    page.getByText('Moved to ' + to + '.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}
async function state(page: Page) {
  return page.evaluate(
    (names) => {
      const tabs = [
        ...document.querySelectorAll(
          '[role="tablist"][aria-label="Email"] [role="tab"]',
        ),
      ];
      return {
        counts: tabs.map((tab) =>
          Number(tab.getAttribute('aria-label')!.split(' ').at(-1)),
        ),
        active: tabs.findIndex(
          (tab) => tab.getAttribute('aria-selected') === 'true',
        ),
        lists: names.map((name) =>
          [
            ...document.querySelectorAll<HTMLElement>(
              '[role="list"][aria-label="' +
                name +
                '"] [data-brief-item], [role="list"][aria-label="' +
                name +
                '"] [data-mail-item]',
            ),
          ].map((row) => ({
            id: row.dataset.briefItem ?? row.dataset.mailItem,
            selected: row.getAttribute('aria-pressed'),
          })),
        ),
        progress: document.querySelector('[aria-label="Brief progress"]')!
          .textContent,
      };
    },
    [...tabs],
  );
}
for (const [origin, id] of [
  ['Needs you', maya.items[0].id],
  ['Heads-up', maya.goodToKnow[0].id],
  ['Other mail', maya.otherMail.rows[0].id],
] as const) {
  test(
    'All six moves and exact Undo for an email from ' + origin,
    async ({ page }) => {
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 844 });
        await cleanStart(page, 'maya');
        const [a, b] = tabs.filter((tab) => tab !== origin);
        const path = [origin, a, origin, b, a, b, origin];
        for (let step = 0; step < path.length - 1; step++) {
          const from = path[step],
            to = path[step + 1];
          await pick(page, from, id);
          if (width === 390) {
            await detail(page)
              .getByRole('button', exact('Close detail'))
              .click();
            await expect(page.getByRole('dialog')).toHaveCount(0);
          }
          const before = await state(page);
          await pick(page, from, id);
          await detail(page).getByRole('button', exact('Move to')).click();
          const menu = page.getByRole('menu', exact('Move to'));
          await expect(
            menu.getByRole('menuitem', { name: new RegExp('^' + from + ' ') }),
          ).toHaveAttribute('aria-disabled', 'true');
          await menu
            .getByRole('menuitem', { name: new RegExp('^' + to + ' ') })
            .click();
          await expect(page.getByRole('button', exact('Undo'))).toBeVisible();
          await expect(page.getByRole('dialog')).toHaveCount(0);
          const after = await state(page);
          expect(after.counts[tabs.indexOf(from)]).toBe(
            before.counts[tabs.indexOf(from)] - 1,
          );
          expect(after.counts[tabs.indexOf(to)]).toBe(
            before.counts[tabs.indexOf(to)] + 1,
          );
          expect(after.lists[tabs.indexOf(to)].at(-1)?.id).toBe(id);
          expect(after.progress).toBe(
            '1 of ' + (after.counts[0] + 1) + ' done',
          );
          await pick(page, to, id);
          if (to === origin) {
            await expect(mailRow(page, to, id)).not.toContainText(
              'Moved by you',
            );
            await expect(
              detail(page).getByText(
                'You moved this here. Glance will sort emails like it the same way.',
                { exact: true },
              ),
            ).toHaveCount(0);
          } else {
            await expect(mailRow(page, to, id)).toContainText('Moved by you');
            await expect(detail(page)).toContainText(
              'You moved this here. Glance will sort emails like it the same way.',
            );
          }
          await expect(
            detail(page).getByRole('link', exact('Open in Outlook')),
          ).toHaveAttribute('href', 'https://outlook.office.com/mail/');
          await page.getByRole('button', exact('Undo')).click();
          await expect(page.getByRole('dialog')).toHaveCount(0);
          await expect.poll(() => state(page)).toEqual(before);
          await expect(mailRow(page, from, id)).toBeFocused();
          await pick(page, from, id);
          await move(page, to);
        }
        await pick(page, origin, id);
        await expect(mailRow(page, origin, id)).not.toContainText(
          'Moved by you',
        );
        expect((await state(page)).lists[tabs.indexOf(origin)].at(-1)?.id).toBe(
          id,
        );
      }
    },
  );
}
test('Maya 8: newsletter moves to Heads-up and Undo restores its exact place', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  const id = maya.otherMail.rows[0].id;
  await pick(page, 'Other mail', id);
  const before = await state(page);
  await move(page, 'Heads-up');
  await expect(page.getByRole('tab', exact('Other mail 30'))).toBeVisible();
  await expect(page.getByRole('tab', exact('Heads-up 4'))).toBeVisible();
  await pick(page, 'Heads-up', id);
  await expect(mailRow(page, 'Heads-up', id)).toContainText(
    'SaaS Sales Weekly: Five renewal plays for Q4',
  );
  await page.getByRole('button', exact('Undo')).click();
  await expect.poll(() => state(page)).toEqual(before);
});
test('Correct a false alarm, preserve facts, and restore the last open Needs you item', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    await pick(page, 'Needs you', 'fernway');
    await detail(page)
      .getByRole('button', { name: /^Contract:/ })
      .click();
    await move(page, 'Other mail');
    await pick(page, 'Other mail', 'fernway');
    await expect(
      detail(page).getByRole('region', exact('Renewal')),
    ).toBeVisible();
    await expect(detail(page).getByRole('button', exact('Done'))).toHaveCount(
      0,
    );
    await expect(detail(page).getByRole('button', exact('Snooze'))).toHaveCount(
      0,
    );
    await detail(page)
      .getByRole('button', { name: /^Contract:/ })
      .click();
    await expect(
      detail(page).getByRole('region', { name: /^Source from / }),
    ).toBeVisible();
    await page.getByRole('button', exact('Undo')).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await pick(page, 'Needs you', 'fernway');
    await expect(
      detail(page).getByRole('button', { name: /^Contract:/ }),
    ).toHaveAttribute('aria-expanded', 'true');
    for (const id of ['fernway', 'brightline', 'halden']) {
      await pick(page, 'Needs you', id);
      await move(page, 'Other mail');
    }
    await expect(page.getByRole('region', exact('All done'))).toBeVisible();
    await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
      '1 of 1 done',
    );
    await page.getByRole('button', exact('Undo')).click();
    await expect(page.getByRole('region', exact('All done'))).toHaveCount(0);
    await expect(mailRow(page, 'Needs you', 'halden')).toBeVisible();
    await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
      '1 of 2 done',
    );
  }
});
test('Other mail keeps its unlisted remainder after every listed email moves', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  for (const item of maya.otherMail.rows.filter((item) => !item.isNew)) {
    await pick(page, 'Other mail', item.id);
    await move(page, 'Heads-up');
    await expect(
      page.getByText('27 more like these', { exact: true }),
    ).toBeVisible();
  }
  await expect(page.getByRole('tab', exact('Other mail 27'))).toBeVisible();
  await expect(page.getByText('Nothing here.', { exact: true })).toHaveCount(0);
  await expect(
    page.getByRole('list', exact('Other mail')).getByRole('button'),
  ).toHaveCount(0);
  await page.getByRole('button', exact('Undo')).click();
  await expect(
    page.getByRole('list', exact('Other mail')).getByRole('button'),
  ).toHaveCount(1);
});

test('Moves preserve new mail and the existing completion paths', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  await pick(page, 'Needs you', 'fernway');
  await move(page, 'Other mail');
  await page.getByRole('button', exact('Add to brief')).click();
  await page.getByRole('button', exact('Undo')).click();
  await expect(page.getByRole('tab', exact('Needs you 4'))).toBeVisible();
  await expect(page.getByRole('tab', exact('Other mail 32'))).toBeVisible();
  await expect(mailRow(page, 'Needs you', 'okto')).toBeVisible();
  await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
    '1 of 5 done',
  );

  await cleanStart(page, 'maya');
  const incoming = maya.goodToKnow[0];
  await pick(page, 'Heads-up', incoming.id);
  await move(page, 'Needs you');
  await pick(page, 'Needs you', incoming.id);
  await detail(page).getByRole('button', exact('Done')).click();
  await expect(
    page.getByRole('button', exact('Undo ' + incoming.title)),
  ).toBeVisible();
  await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
    '2 of 5 done',
  );
  await page.getByRole('button', exact('Undo ' + incoming.title)).click();
  await expect(mailRow(page, 'Needs you', incoming.id)).toBeVisible();

  await cleanStart(page, 'maya');
  await pick(page, 'Needs you', 'fernway');
  await detail(page).getByRole('button', exact('Snooze')).click();
  await detail(page).getByRole('button', exact('Tomorrow, 8:00 AM')).click();
  await page.getByRole('button', exact(maya.demo.simulate.label)).click();
  await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
    '2 of 4 done',
  );
  await expect(
    page.getByText('Fernway Logistics · ' + maya.demo.simulate.note, {
      exact: true,
    }),
  ).toBeVisible();
});

test('Move Undo also restores an email during its completion animation', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  const id = maya.goodToKnow[0].id;
  await pick(page, 'Heads-up', id);
  const before = await state(page);
  await move(page, 'Needs you');
  await pick(page, 'Needs you', id);
  await detail(page)
    .getByRole('button', exact('Done'))
    .evaluate((button) => {
      if (!(button instanceof HTMLButtonElement))
        throw new Error('Expected a button');
      button.click();
      const undo = [
        ...document.querySelectorAll<HTMLButtonElement>(
          '[role="status"] button',
        ),
      ].find((node) => node.textContent?.trim() === 'Undo');
      if (!undo) throw new Error('Missing move Undo');
      undo.click();
    });
  await expect.poll(() => state(page)).toEqual(before);
});
