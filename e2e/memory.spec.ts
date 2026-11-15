import { expect, test, type Page } from '@playwright/test';
import { cleanStart, exact } from './helpers';

function entry(page: Page, width: number) {
  return width === 390
    ? page.getByRole('button', exact('Memory'))
    : page.getByRole('tab', { name: /^Memory / });
}
const instructions = (page: Page) =>
  page.getByRole('list', exact('Your instructions')).getByRole('listitem');
const learned = (page: Page) =>
  page.getByRole('list', exact('Learned')).getByRole('listitem');
const undo = (page: Page) => page.getByRole('button', exact('Undo'));
const promoted = 'Keep Brightline admin reports in Heads-up.';

async function assertCounts(
  page: Page,
  width: number,
  own: number,
  patterns: number,
) {
  await expect(
    page.getByRole('heading', exact('Your instructions ' + own)),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', exact('Learned ' + patterns)),
  ).toBeVisible();
  await expect(instructions(page)).toHaveCount(own);
  await expect(learned(page)).toHaveCount(patterns);
  if (width !== 390)
    await expect(
      page.getByRole('tab', {
        ...exact('Memory ' + (own + patterns)),
        selected: true,
      }),
    ).toBeVisible();
}
async function openMemory(page: Page, width: number) {
  await entry(page, width).click();
  const heading = page.getByRole('heading', exact('Memory'));
  await expect(heading).toBeFocused();
  await expect(heading).toHaveCSS('outline-style', 'none');
}

test('Memory edits promote learned patterns and Undo restores both sections', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await cleanStart(page, 'maya');
    await openMemory(page, width);
    await assertCounts(page, width, 2, 3);
    const originalOwn = await instructions(page).allTextContents();
    const originalLearned = await learned(page).allTextContents();

    await page.getByRole('button', exact('Add')).click();
    const add = page.getByRole('textbox', exact('Add an instruction'));
    await expect(add).toBeFocused();
    await add.fill('   ');
    await expect(
      page
        .getByRole('form', exact('Add an instruction'))
        .getByRole('button', exact('Add')),
    ).toBeDisabled();
    await add.press('Escape');
    await expect(page.getByRole('button', exact('Add'))).toBeFocused();
    await page.getByRole('button', exact('Add')).click();
    await add.fill('Flag customer pricing questions.');
    await add.press('Enter');
    await assertCounts(page, width, 3, 3);
    await expect(instructions(page).last()).toContainText('Added today');
    await expect(
      page.getByText('Glance follows it from the next email.', { exact: true }),
    ).toBeVisible();
    await undo(page).click();
    await assertCounts(page, width, 2, 3);

    await learned(page)
      .first()
      .getByRole('button', { name: /^Edit / })
      .click();
    const edit = page.getByRole('textbox', exact('Edit memory note'));
    await expect(edit).toBeFocused();
    await edit.fill('');
    await expect(page.getByRole('button', exact('Save'))).toBeDisabled();
    await edit.fill(promoted);
    await edit.press('Enter');
    await assertCounts(page, width, 3, 2);
    await expect(instructions(page).last()).toContainText(promoted);
    await expect(instructions(page).last()).toContainText(
      'Was learned · edited just now',
    );
    await expect(
      instructions(page)
        .last()
        .getByRole('button', { name: /^Edit / }),
    ).toBeFocused();
    await expect(
      page.getByText('Saved as your instruction.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Your instructions always win.', { exact: true }),
    ).toBeVisible();
    await undo(page).click();
    await assertCounts(page, width, 2, 3);
    expect(await learned(page).allTextContents()).toEqual(originalLearned);

    await instructions(page)
      .first()
      .getByRole('button', { name: /^Edit / })
      .click();
    await edit.fill('Keep pricing questions in Needs you.');
    await edit.press('Enter');
    await expect(instructions(page).first()).toContainText(
      'Keep pricing questions in Needs you.',
    );
    await expect(page.getByText('Saved.', { exact: true })).toBeVisible();
    await undo(page).click();
    await expect(instructions(page).first()).toContainText('Pricing questions');
    for (const rows of [instructions(page), learned(page)]) {
      const before = await rows.allTextContents();
      await rows
        .first()
        .getByRole('button', { name: /^Remove / })
        .click();
      await expect(rows).toHaveCount(before.length - 1);
      await expect(
        page.getByText('Removed from Memory.', { exact: true }),
      ).toBeVisible();
      await undo(page).click();
      await expect(rows).toHaveCount(before.length);
      expect(await rows.allTextContents()).toEqual(before);
      await expect(
        rows.first().getByRole('button', { name: /^Edit / }),
      ).toBeFocused();
    }
    expect(await instructions(page).allTextContents()).toEqual(originalOwn);
  }
});

test('Memory phone layout gives both row actions 44-pixel targets and returns to the previous tab', async ({
  page,
}) => {
  const width = 390;
  await page.setViewportSize({ width, height: 844 });
  await cleanStart(page, 'maya');
  const heads = page.getByRole('tab', exact('Heads-up 3'));
  await heads.click();
  await openMemory(page, width);
  await expect(heads).toBeHidden();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  for (const note of [instructions(page).first(), learned(page).first()]) {
    const buttons = note.getByRole('button');
    const [edit, remove] = await Promise.all([
      buttons.nth(0).boundingBox(),
      buttons.nth(1).boundingBox(),
    ]);
    const row = await note.boundingBox();
    const meta = await note.locator('p').last().boundingBox();
    expect(edit!.y).toBe(remove!.y);
    expect(edit!.y).toBeGreaterThan(meta!.y + meta!.height);
    expect(remove!.x + remove!.width).toBeCloseTo(row!.x + row!.width);
    for (const action of [edit!, remove!]) {
      expect(action.width).toBeGreaterThanOrEqual(44);
      expect(action.height).toBeGreaterThanOrEqual(44);
    }
  }
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(width);
  await page.getByRole('button', exact('Back to brief')).click();
  await expect(heads).toHaveAttribute('aria-selected', 'true');
  await expect(heads).toBeFocused();
});

test('Memory is scoped to the persona session', async ({ page }) => {
  await cleanStart(page, 'maya');
  const watchTab = page.getByRole('tab', { name: /^Watchlist / });
  const memoryTab = entry(page, 1280);
  await watchTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(memoryTab).toBeFocused();
  await assertCounts(page, 1280, 2, 3);
  await page.keyboard.press('ArrowLeft');
  await expect(watchTab).toBeFocused();
  await expect(watchTab).toHaveAttribute('aria-selected', 'true');
  await openMemory(page, 1280);
  await instructions(page)
    .first()
    .getByRole('button', { name: /^Remove / })
    .click();
  await assertCounts(page, 1280, 1, 3);
  await page.getByRole('tab', exact('Needs you 3')).click();
  await openMemory(page, 1280);
  await assertCounts(page, 1280, 1, 3);
  await page.getByRole('button', exact('Daniel · Manager')).click();
  await openMemory(page, 1280);
  await expect(instructions(page).first()).not.toContainText(
    'Pricing questions',
  );
  await page.getByRole('button', exact('Maya · Sales')).click();
  await openMemory(page, 1280);
  await assertCounts(page, 1280, 2, 3);
});
