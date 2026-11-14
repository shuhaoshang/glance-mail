import { test, expect } from '@playwright/test';
import type { Persona, PersonaId } from '../src/data/types';
import maya from '../src/data/maya.json' with { type: 'json' };
import daniel from '../src/data/daniel.json' with { type: 'json' };
import sarah from '../src/data/sarah.json' with { type: 'json' };
const getPersona = (id: PersonaId) =>
  ({ maya, daniel, sarah })[id] as unknown as Persona;
import { cleanStart, detail, exact, row } from './helpers';

const inboxes = {
  Outlook: 'https://outlook.office.com/mail/',
  Gmail: 'https://mail.google.com/',
  'Yahoo Mail': 'https://mail.yahoo.com/',
};

test('Three email tabs expose counts, accounts, keyboard order, and responsive panels', async ({
  page,
}) => {
  for (const width of [1280, 1024, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const id of ['maya', 'daniel', 'sarah'] as const) {
      const persona = getPersona(id);
      await cleanStart(page, id);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      const tabs = page.getByRole('tablist', exact('Email'));
      await expect(tabs.getByRole('tab')).toHaveCount(3);
      await expect(page.getByRole('tablist', exact('Glance'))).toHaveCount(0);
      await expect(
        page.getByRole('button', { name: /set aside|Show in brief|Move to/ }),
      ).toHaveCount(0);
      await expect(page.getByRole('dialog')).toHaveCount(0);
      if (width < 960) await expect(detail(page)).toHaveCount(0);
      const groups = [
        {
          label: 'Needs you',
          items: persona.items.filter((item) => !item.isNew),
          total: persona.items.filter((item) => !item.isNew).length,
        },
        {
          label: 'Heads-up',
          items: persona.goodToKnow,
          total: persona.goodToKnow.length,
        },
        {
          label: 'Other mail',
          items: persona.otherMail.rows.filter((item) => !item.isNew),
          total: persona.otherMail.total,
        },
      ];
      for (const group of groups) {
        const tab = tabs.getByRole(
          'tab',
          exact(group.label + ' ' + group.total),
        );
        await tab.click();
        await expect(tab).toHaveAttribute('aria-selected', 'true');
        const panel = page.getByRole(
          'tabpanel',
          exact(group.label + ' ' + group.total),
        );
        await expect(panel).toBeVisible();
        const list = panel.getByRole('list', exact(group.label));
        for (const [index, item] of group.items.entries()) {
          const label =
            'name' in item
              ? item.name
              : 'title' in item
                ? item.title
                : item.sender;
          const button = list
            .getByRole('button')
            .filter({ has: page.getByText(label, { exact: true }) });
          if (index === 0)
            await expect(button).toHaveAttribute(
              'aria-pressed',
              String(width >= 960),
            );
          await button.click();
          await expect(detail(page)).toContainText(
            group.label + ' · ' + (index + 1) + ' of ' + group.total,
          );
          const accountId = 'account' in item ? item.account : undefined;
          const account =
            persona.accounts.find((a) => a.id === accountId) ??
            persona.accounts.find((a) => !a.minority)!;
          await expect(
            detail(page).getByRole('link', exact('Open in ' + account.app)),
          ).toHaveAttribute('href', inboxes[account.app]);
          if (width < 960) {
            await detail(page)
              .getByRole('button', exact('Close detail'))
              .click();
            await expect(page.getByRole('dialog')).toHaveCount(0);
            await expect(button).toBeFocused();
          }
        }
        await expect
          .poll(() =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= window.innerWidth,
            ),
          )
          .toBe(true);
      }
      const needs = tabs.getByRole('tab', { name: /^Needs you/ });
      await needs.focus();
      await page.keyboard.press('ArrowRight');
      await expect(
        tabs.getByRole('tab', { name: /^Heads-up/ }),
      ).toHaveAttribute('aria-selected', 'true');
      await page.keyboard.press('Tab');
      const first = page
        .getByRole('list', exact('Heads-up'))
        .getByRole('button')
        .first();
      await expect(first).toBeFocused();
      for (let i = 1; i < persona.goodToKnow.length; i++)
        await page.keyboard.press('Tab');
      if (width >= 960) {
        await page.keyboard.press('Tab');
        await expect(
          detail(page).getByRole('tab', exact('Details')),
        ).toBeFocused();
      }
    }
  }
});

test('Tab and item changes preserve source, reasoning, Ask, checklist, and email state', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'sarah');
    const persona = getPersona('sarah');
    const item = persona.items[0];
    const needsTab = page.getByRole('tab', exact('Needs you 3'));
    const otherTab = page.getByRole('tab', exact('Other mail 18'));
    const close = async () => {
      if (width < 960) {
        await detail(page).getByRole('button', exact('Close detail')).click();
        await expect(page.getByRole('dialog')).toHaveCount(0);
      }
    };
    await row(page, item.name).click();
    await detail(page)
      .getByRole('checkbox', exact('Sign the permission slip'))
      .check();
    const field = detail(page)
      .getByRole('button', { name: /Show where the email says so/ })
      .first();
    const fieldName = await field.getAttribute('aria-label');
    await field.click();
    await detail(page)
      .getByRole('button', { name: /^Why it’s/ })
      .click();
    await detail(page).getByRole('tab', exact('Ask')).click();
    await detail(page).getByRole('button', exact(item.qa[0].q)).click();
    await expect(
      detail(page).getByRole('region', exact('Answer to ' + item.qa[0].q)),
    ).toBeVisible();
    await close();
    await otherTab.click();
    await expect(page.getByRole('list', exact('Other mail'))).toBeVisible();
    await needsTab.click();
    if (width < 960) await row(page, item.name).click();
    await expect(detail(page).getByRole('tab', exact('Ask'))).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      detail(page).getByRole('region', exact('Answer to ' + item.qa[0].q)),
    ).toBeVisible();
    await detail(page).getByRole('tab', exact('Details')).click();
    await expect(
      detail(page).getByRole('checkbox', exact('Sign the permission slip')),
    ).toBeChecked();
    await expect(
      detail(page).getByRole('button', exact(fieldName!)),
    ).toHaveAttribute('aria-expanded', 'true');
    await expect(
      detail(page).getByRole('button', { name: /^Why it’s/ }),
    ).toHaveAttribute('aria-expanded', 'true');
    await detail(page).getByRole('tab', exact('Original email')).click();
    await detail(page).getByRole('switch', exact('Highlighter')).uncheck();
    await close();
    await row(page, persona.items[1].name).click();
    await close();
    await row(page, item.name).click();
    await expect(
      detail(page).getByRole('tab', exact('Original email')),
    ).toHaveAttribute('aria-selected', 'true');
    await expect(
      detail(page).getByRole('switch', exact('Highlighter')),
    ).not.toBeChecked();
    await close();
    await page.getByRole('tab', exact('Heads-up 2')).click();
    const heads = page
      .getByRole('list', exact('Heads-up'))
      .getByRole('button')
      .last();
    await heads.click();
    await detail(page).getByRole('tab', exact('Original email')).click();
    await close();
    await otherTab.click();
    await page.getByRole('tab', exact('Heads-up 2')).click();
    if (width < 960) await heads.click();
    await expect(
      detail(page).getByRole('tab', exact('Original email')),
    ).toHaveAttribute('aria-selected', 'true');
  }
});

test('Review states keep header words intact, update AllDone, and show plain Watchlist attribution', async ({
  page,
}) => {
  for (const width of [1280, 1024, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    await row(page, maya.items[0].name).click();
    if (width >= 960) {
      const position = detail(page).getByText('Needs you · 1 of 3', {
        exact: true,
      });
      const tabs = detail(page).getByRole('tablist', exact('Item views'));
      const [positionBox, tabsBox] = await Promise.all([
        position.boundingBox(),
        tabs.boundingBox(),
      ]);
      if (width === 1024)
        expect(tabsBox!.y - positionBox!.y - positionBox!.height).toBe(12);
      else expect(positionBox!.y).toBeGreaterThanOrEqual(tabsBox!.y);
      for (const name of ['Details', 'Ask']) {
        const lines = await tabs
          .getByRole('tab', exact(name))
          .evaluate((node) => {
            const range = document.createRange();
            range.selectNodeContents(node);
            return new Set([...range.getClientRects()].map((rect) => rect.y))
              .size;
          });
        expect(lines).toBe(1);
      }
    }
    await detail(page)
      .getByRole('button', { name: /^Why it’s first:/ })
      .click();
    const attribution = 'Based on Watchlist: Fernway renewal';
    await expect(
      detail(page).getByText(attribution, { exact: true }),
    ).toBeVisible();
    await expect(
      detail(page).getByRole('button', { name: /Watchlist:/ }),
    ).toHaveCount(0);
    await expect(
      detail(page).getByRole('link', { name: /Watchlist:/ }),
    ).toHaveCount(0);
    if (width === 390) {
      await detail(page).getByRole('button', exact('Close detail')).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    await page.getByRole('tab', exact('Heads-up 3')).click();
    await page
      .getByRole('list', exact('Heads-up'))
      .getByRole('button')
      .first()
      .click();
    await expect(
      detail(page).getByText('Part of Watchlist: Fernway renewal', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      detail(page).getByRole('button', { name: /Watchlist:/ }),
    ).toHaveCount(0);
    await expect(
      detail(page).getByRole('link', { name: /Watchlist:/ }),
    ).toHaveCount(0);
    if (width === 390) {
      await detail(page).getByRole('button', exact('Close detail')).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    await page.getByRole('tab', exact('Needs you 3')).click();
    for (const item of maya.items.filter((item) => !item.isNew)) {
      await row(page, item.name).click();
      if (item.id === 'halden') {
        await detail(page).getByRole('button', exact('Snooze')).click();
        await detail(page)
          .getByRole('button', exact('Tomorrow, 8:00 AM'))
          .click();
      } else await detail(page).getByRole('button', exact('Done')).click();
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(
        page.getByRole('button', exact('Undo ' + item.name)),
      ).toBeVisible();
    }
    const empty = page.getByRole('region', exact('All done'));
    await expect(empty).toContainText(
      '3 of 4 actions done. 1 snoozed item will come back later. 3 emails in Heads-up and 31 in Other mail.',
    );
    await expect(empty).not.toContainText('good to know');
    await page.getByRole('button', exact('Undo Halden Health')).click();
    await row(page, 'Halden Health').click();
    await detail(page).getByRole('button', exact('Done')).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(empty).toContainText(
      '4 of 4 actions done. 3 emails in Heads-up and 31 in Other mail.',
    );
  }
});
