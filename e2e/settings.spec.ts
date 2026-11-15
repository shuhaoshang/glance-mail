import { expect, test, type Page } from '@playwright/test';
import { cleanStart, exact } from './helpers';
import type { PersonaId } from '../src/data/types';
import maya from '../src/data/maya.json' with { type: 'json' };
import daniel from '../src/data/daniel.json' with { type: 'json' };
import sarah from '../src/data/sarah.json' with { type: 'json' };
const getPersona = (id: PersonaId) => ({ maya, daniel, sarah })[id];

const menu = (page: Page) => page.getByRole('menu', exact('Account'));
async function action(page: Page, item: string) {
  await page.getByRole('button', { name: /^Account for / }).click();
  await menu(page)
    .getByRole('menuitem', { name: new RegExp('^' + item) })
    .click();
}
function section(page: Page, name: string) {
  return page.getByRole('region', exact(name));
}

test('Settings shows the persona inboxes and quiet-hours default, with focusable desktop sections', async ({
  page,
}) => {
  for (const id of ['maya', 'daniel', 'sarah'] as const) {
    const persona = getPersona(id);
    await cleanStart(page, id);
    await page
      .getByRole('button', exact('Account for ' + persona.name))
      .click();
    const inboxShortcut = menu(page).getByRole(
      'menuitem',
      exact('Inboxes ' + persona.accounts.length + ' connected'),
    );
    await expect(inboxShortcut).toBeFocused();
    await inboxShortcut.click();
    await expect(page.getByRole('heading', exact('Inboxes'))).toBeFocused();
    const inboxes = section(page, 'Inboxes');
    await expect(inboxes.getByRole('listitem')).toHaveCount(
      persona.accounts.length,
    );
    for (const [index, account] of persona.accounts.entries())
      await expect(inboxes.getByRole('listitem').nth(index)).toContainText(
        account.app,
      );
    await expect(
      page.getByRole('switch', exact('Hold work email in the evening')),
    ).toHaveAttribute('aria-checked', String(id === 'daniel'));

    const nav = page.getByRole('navigation', exact('Settings sections'));
    for (const name of [
      'Brief',
      'Notifications',
      'Quiet hours',
      'Appearance',
      'Account',
    ]) {
      const link = nav.getByRole('link', exact(name));
      await link.click();
      await expect(page.getByRole('heading', exact(name))).toBeFocused();
      await expect(link).toHaveAttribute('aria-current', 'location');
    }
  }
});

test('Settings hand back the brief selection at desktop and phone widths', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    const tab = page.getByRole('tab', exact('Heads-up 3'));
    await tab.click();
    const row = page
      .getByRole('list', exact('Heads-up'))
      .getByRole('button')
      .nth(1);
    await row.click();
    await page.getByRole('tab', exact('Original email')).click();
    if (width === 390) {
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
    }
    const before = page.url();
    await action(page, 'Settings');
    await expect(page.getByRole('heading', exact('Settings'))).toBeFocused();
    expect(page.url()).toBe(before);
    if (width === 390)
      await expect(
        page.getByRole('navigation', exact('Settings sections')),
      ).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.getByRole('button', exact('Back to brief')).click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(tab).toBeFocused();
    if (width === 1280)
      await expect(row).toHaveAttribute('aria-pressed', 'true');
  }
});

test('Settings controls stay in session, demo confirmations preserve data, and theme is shared', async ({
  page,
}) => {
  await cleanStart(page, 'daniel');
  await action(page, 'Settings');
  const inboxes = section(page, 'Inboxes');
  const disconnect = inboxes.getByRole(
    'button',
    exact('Disconnect Gmail Work'),
  );
  const connect = inboxes.getByRole('button', exact('Connect'));
  const account = section(page, 'Account');
  const remove = account.getByRole('button', exact('Delete'));
  for (const button of [disconnect, connect, remove]) {
    await button.click();
    const ok = page.getByRole('button', exact('OK'));
    await expect(ok).toBeFocused();
    await expect(
      page.getByText('This is a demo. Nothing was changed.', { exact: true }),
    ).toBeVisible();
    await ok.click();
    await expect(ok).toHaveCount(0);
    await expect(button).toBeFocused();
  }
  await expect(inboxes.getByRole('listitem')).toHaveCount(2);
  await page
    .getByRole('combobox', exact('Morning brief'))
    .selectOption('8:00 AM');
  await page.getByRole('combobox', exact('From')).selectOption('8:00 PM');
  await page.getByRole('combobox', exact('Until')).selectOption('6:00 AM');
  await page.getByRole('switch', exact('Brief is ready')).uncheck();
  await page
    .getByRole('switch', exact('A Needs you item is due today'))
    .check();
  await page
    .getByRole('switch', exact('Hold work email in the evening'))
    .uncheck();
  const theme = page.getByRole('radiogroup', exact('Theme'));
  await theme.getByRole('radio', exact('Dark')).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', exact('Back to brief')).click();
  await expect(
    page.getByText('Quiet hours: work email hides after 7:00 PM', {
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole('button', exact('Account for Daniel')).click();
  await expect(
    menu(page).getByRole('menuitemradio', exact('Dark')),
  ).toBeChecked();
  await menu(page).getByRole('menuitem', exact('Settings')).click();
  await expect(page.getByRole('combobox', exact('Morning brief'))).toHaveValue(
    '8:00 AM',
  );
  await expect(page.getByRole('combobox', exact('From'))).toHaveValue(
    '8:00 PM',
  );
  await expect(page.getByRole('combobox', exact('Until'))).toHaveValue(
    '6:00 AM',
  );
  await expect(
    page.getByRole('switch', exact('Brief is ready')),
  ).not.toBeChecked();
  await expect(
    page.getByRole('switch', exact('A Needs you item is due today')),
  ).toBeChecked();
  await expect(
    page.getByRole('switch', exact('Hold work email in the evening')),
  ).not.toBeChecked();
});

test('Both sign-in choices return to the brief and the demo bar stays visible', async ({
  page,
}) => {
  const id: PersonaId = 'sarah';
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, id);
    const bar = page.getByRole('complementary', exact('Demo controls'));
    const accountButton = page.getByRole('button', exact('Account for Sarah'));
    await action(page, 'Log out');
    for (const provider of ['Microsoft', 'Google']) {
      await expect(
        page.getByRole('heading', exact('You’re signed out')),
      ).toBeFocused();
      await expect(bar).toBeVisible();
      await expect(accountButton).toHaveCount(0);
      await page
        .getByRole('button', exact('Continue with ' + provider))
        .click();
      await expect(
        page.getByRole('heading', exact(getPersona(id).greeting)),
      ).toBeVisible();
      if (provider === 'Microsoft') {
        await action(page, 'Settings');
        await expect(bar).toBeVisible();
        await section(page, 'Account')
          .getByRole('button', exact('Log out'))
          .click();
      }
    }
  }
});
