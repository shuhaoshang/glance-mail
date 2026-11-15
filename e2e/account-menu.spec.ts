import { expect, test } from '@playwright/test';
import { cleanStart, exact } from './helpers';

test('Account Appearance applies immediately, survives reload, and follows System', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await cleanStart(page, 'maya');
  const root = page.locator('html');
  const avatar = page.getByRole('button', exact('Account for Maya'));
  const choice = (name: string) => page.getByRole('menuitemradio', exact(name));
  const background = () =>
    page
      .locator('body')
      .evaluate((body) => getComputedStyle(body).backgroundImage);
  const light = await background();
  await avatar.click();
  await expect(choice('System')).toBeChecked();
  await choice('Dark').click();
  await expect(root).toHaveAttribute('data-theme', 'dark');
  await expect.poll(background).not.toBe(light);
  const dark = await background();
  await page.reload();
  await avatar.click();
  await expect(choice('Dark')).toBeChecked();
  expect(await background()).toBe(dark);
  await page.emulateMedia({ colorScheme: 'dark' });
  await choice('Light').click();
  await expect(root).toHaveAttribute('data-theme', 'light');
  await expect.poll(background).toBe(light);
  await page.reload();
  await avatar.click();
  await expect(choice('Light')).toBeChecked();
  await choice('System').click();
  await expect(root).not.toHaveAttribute('data-theme', /.+/);
  await expect.poll(background).toBe(dark);
  await page.reload();
  await avatar.click();
  await expect(choice('System')).toBeChecked();
  await page.emulateMedia({ colorScheme: 'light' });
  await expect.poll(background).toBe(light);
});

test('Account menu restores avatar focus on dismissal and has full-width phone choices', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem('glance-theme'));
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    const avatar = page.getByRole('button', exact('Account for Maya'));
    const menu = page.getByRole('menu', exact('Account'));
    const system = menu.getByRole('menuitemradio', exact('System'));
    const wordmark = page
      .getByRole('main')
      .getByText('glance', { exact: true });
    const needs = page.getByRole('tab', exact('Needs you 3'));
    await avatar.focus();
    await avatar.press('Enter');
    await expect(menu).toHaveText(/maya@example.com/);
    await expect(menu.getByRole('menuitemradio')).toHaveCount(3);
    const inboxes = menu.getByRole('menuitem', exact('Inboxes 1 connected'));
    await expect(inboxes).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(menu.getByRole('menuitem', exact('Settings'))).toBeFocused();
    await page.keyboard.press('ArrowDown');
    await expect(system).toBeFocused();
    const triggerBox = (await avatar.boundingBox())!;
    const menuBox = (await menu.boundingBox())!;
    expect(triggerBox.width).toBe(40);
    expect(triggerBox.height).toBe(40);
    expect(menuBox.y - triggerBox.y - triggerBox.height).toBe(8);
    expect(menuBox.x + menuBox.width).toBe(triggerBox.x + triggerBox.width);
    const appearance = menu.getByRole('group', exact('Appearance'));
    if (width === 390) {
      for (const item of await appearance.getByRole('menuitemradio').all())
        await expect(item).toHaveCSS('height', '44px');
      const group = (await appearance.boundingBox())!;
      const label = (await menu
        .getByText('Appearance', { exact: true })
        .boundingBox())!;
      expect(group.x).toBe(label.x);
      expect(group.y).toBeGreaterThan(label.y + label.height);
      expect(group.width).toBeGreaterThan(menuBox.width - 48);
    }
    await page.keyboard.press('ArrowDown');
    const light = menu.getByRole('menuitemradio', exact('Light'));
    await expect(light).toBeFocused();
    await expect(system).toBeChecked();
    await page.keyboard.press('Space');
    await expect(light).toBeChecked();
    await page.keyboard.press('Escape');
    await expect(menu).toHaveCount(0);
    await expect(avatar).toBeFocused();

    await avatar.click();
    await wordmark.click();
    await expect(menu).toHaveCount(0);
    await expect(avatar).toBeFocused();

    await avatar.click();
    await needs.focus();
    await expect(menu).toHaveCount(0);
    await expect(avatar).toBeFocused();

    await avatar.click();
    await page.keyboard.press('Tab');
    await expect(menu).toHaveCount(0);
    await expect(avatar).toBeFocused();

    await avatar.click();
    await avatar.click();
    await expect(menu).toHaveCount(0);
  }
});

test('Demo controls retain persona, levels, and simulated replies after Appearance moves', async ({
  page,
}) => {
  await cleanStart(page, 'maya');
  const demo = page.getByRole('complementary', exact('Demo controls'));
  await expect(demo.getByRole('group', exact('Demo theme'))).toHaveCount(0);
  await expect(
    demo.getByRole('button', exact('Simulate reply to Priya')),
  ).toBeEnabled();
  await demo.getByRole('button', exact('Daniel · Manager')).click();
  await expect(
    page.getByRole('button', exact('Account for Daniel')),
  ).toBeVisible();
  await demo.getByRole('button', exact('2 Formatted')).click();
  await expect(
    page.getByRole('button', exact('Account for Daniel')),
  ).toBeVisible();
  await demo.getByRole('button', exact('3 Glance')).click();
  await demo.getByRole('button', exact('Maya · Sales')).click();
  await demo.getByRole('button', exact('Simulate reply to Priya')).click();
  await expect(
    page.getByRole('button', exact('Undo Fernway Logistics')),
  ).toBeVisible();
});
