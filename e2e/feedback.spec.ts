import { expect, test, type Page, type Locator } from '@playwright/test';
import maya from '../docs/handoff/v2/provided/data/maya.json' with { type: 'json' };
async function story(page: Page, id: string, theme: string) {
  const url = new URL('http://127.0.0.1:6196/iframe.html');
  url.searchParams.set('id', id);
  url.searchParams.set('viewMode', 'story');
  url.searchParams.set('globals', 'theme:' + theme);
  await page.goto(url.href);
  const result = () =>
    page.evaluate(() => {
      const render = (
        window as unknown as {
          __STORYBOOK_PREVIEW__?: {
            currentRender?: {
              channel: { last: (name: string) => unknown[] | undefined };
            };
          };
        }
      ).__STORYBOOK_PREVIEW__?.currentRender;
      const channel = render?.channel;
      const finished = channel?.last('storyFinished')?.[0] as
        { status?: string } | undefined;
      return {
        status: finished?.status,
        error:
          channel?.last('playFunctionThrewException') ??
          channel?.last('storyThrewException') ??
          channel?.last('unhandledErrorsWhilePlaying'),
      };
    });
  await expect.poll(async () => (await result()).status).toBe('success');
  expect((await result()).error).toBeUndefined();
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
}

test('MoveMenu blocks the current destination and restores focus', async ({
  page,
  colorScheme,
}) => {
  await story(
    page,
    'composites-movemenu--keyboard-and-dismissal',
    colorScheme!,
  );
  for (const current of ['default', 'heads-up', 'other-mail']) {
    await story(page, 'composites-movemenu--' + current, colorScheme!);
    const menu = page.getByRole('menu', { name: 'Move to' });
    const disabled = menu.getByRole('menuitem', { disabled: true });
    await expect(disabled).toHaveCount(1);
    await disabled.hover();
    await disabled.click({ force: true });
    await expect(menu).toBeVisible();
    await disabled.focus();
    await page.keyboard.press('Space');
    await expect(menu).toBeVisible();
    await expect(page.getByRole('status')).toBeEmpty();
    await disabled.hover();
    await expect(disabled).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Move to', exact: true }),
    ).toBeFocused();
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'composites-movemenu--in-sheet', colorScheme!);
  const dialog = page.getByRole('dialog');
  const trigger = dialog.getByRole('button', { name: 'Move to', exact: true });
  const menu = dialog.getByRole('menu', { name: 'Move to' });
  await expect(
    menu.getByRole('menuitem', { name: 'Heads-up No action needed' }),
  ).toBeFocused();
  await expect(menu).toHaveCSS('width', '390px');
  const menuBox = await menu.boundingBox(),
    triggerBox = await trigger.boundingBox();
  expect(menuBox!.y + menuBox!.height).toBeLessThanOrEqual(triggerBox!.y);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByText('Select outside the menu to close it.').click();
  await expect(menu).toHaveCount(0);
  await expect(dialog).toBeVisible();
  await expect(trigger).toBeFocused();
});

test('Toast replaces, pauses for hover and focus, and invokes Undo once', async ({
  page,
  colorScheme,
}) => {
  await page.clock.install();
  await story(page, 'primitives-toast--interactive', colorScheme!);
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 1000));
  const show = page.getByRole('button', { name: 'Show move confirmation' });
  const saved = page.getByRole('button', { name: 'Show saved confirmation' });
  const status = page.getByRole('status');
  await show.click();
  await expect(status).toContainText('Moved to Heads-up.');
  await page.clock.runFor(5000);
  await status.hover();
  await page.clock.runFor(15000);
  await expect(status).toContainText('Moved to Heads-up.');
  await page.getByRole('button', { name: 'Undo', exact: true }).focus();
  await page.mouse.move(0, 0);
  await page.clock.runFor(15000);
  await expect(status).toContainText('Moved to Heads-up.');
  await saved.focus();
  await page.clock.runFor(999);
  await expect(status).toContainText('Moved to Heads-up.');
  await page.clock.runFor(1);
  await expect(status).toBeEmpty();
  await show.click();
  await page.clock.runFor(5000);
  await saved.click();
  await expect(status).toHaveCount(1);
  await expect(status).toContainText('Saved.');
  await expect(status).not.toContainText('Moved to');
  await page.clock.runFor(5999);
  await expect(status).toContainText('Saved.');
  await page.clock.runFor(1);
  await expect(status).toBeEmpty();
  await show.click();
  await page.getByRole('button', { name: 'Undo', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByText('Undo calls: 1', { exact: true })).toBeVisible();
  await expect(status).toBeEmpty();
  await expect(show).toBeFocused();
  await show.click();
  await page.getByRole('button', { name: 'Undo', exact: true }).dblclick();
  await expect(page.getByText('Undo calls: 2', { exact: true })).toBeVisible();
  await expect(status).toBeEmpty();
  await show.click();
  await page.getByRole('button', { name: 'Undo', exact: true }).focus();
  await saved.evaluate((element) => {
    if (!(element instanceof HTMLButtonElement))
      throw new Error('Expected a confirmation trigger.');
    element.click();
  });
  await expect(
    page.getByRole('button', { name: 'Close confirmation' }),
  ).toBeFocused();
  await page.clock.runFor(15000);
  await expect(status).toContainText('Saved.');
  await page.keyboard.press('Enter');
  await expect(show).toBeFocused();
  await saved.click();
  await expect(
    page.getByRole('button', { name: 'Undo', exact: true }),
  ).toHaveCount(0);
  await page.getByRole('button', { name: 'Close confirmation' }).click();
  await expect(saved).toBeFocused();
  await expect(status).toBeEmpty();
});

test('Phone toast stays in the dialog above a changing action bar', async ({
  page,
  colorScheme,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'primitives-toast--in-sheet', colorScheme!);
  const dialog = page.getByRole('dialog');
  const toast = dialog.getByRole('status');
  await expect(toast).toContainText('Moved to Heads-up.');
  await toast.hover();
  const bar = dialog
    .getByRole('button', { name: 'Show confirmation' })
    .locator('..');
  const assertPosition = async () => {
    await expect
      .poll(async () => {
        const t = await toast.boundingBox(),
          a = await bar.boundingBox();
        return Math.round(a!.y - t!.y - t!.height);
      })
      .toBe(16);
    const t = await toast.boundingBox();
    expect(t!.x).toBe(16);
    expect(t!.width).toBe(358);
  };
  await assertPosition();
  await dialog.getByRole('button', { name: 'Toggle action bar size' }).click();
  await toast.hover();
  await assertPosition();
  await toast.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(toast).toBeEmpty();
  await expect(
    dialog.getByRole('button', { name: 'Show confirmation' }),
  ).toBeFocused();
});

test('TextInput and InlineForm support labels, empty validation, Enter, and Escape', async ({
  page,
  colorScheme,
}) => {
  await story(page, 'primitives-textinput--focused', colorScheme!);
  const input = page.getByRole('textbox', { name: 'Watchlist topic' });
  await expect(input).toHaveCSS('height', '48px');
  await expect(input).toHaveCSS('outline-style', 'none');
  await expect(input).toHaveCSS('box-shadow', /1\.5px inset/);
  await story(page, 'composites-inlineform--submit-and-cancel', colorScheme!);
  await expect(page.getByRole('button', { name: 'Open form' })).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, 'composites-inlineform--empty', colorScheme!);
  const field = page.getByRole('textbox', { name: 'Watchlist topic' });
  const add = page.getByRole('button', { name: 'Add', exact: true });
  const cancel = page.getByRole('button', { name: 'Cancel', exact: true });
  const row = field.locator('..');
  const [inputBox, addBox, cancelBox, rowBox] = await Promise.all([
    field.boundingBox(),
    add.boundingBox(),
    cancel.boundingBox(),
    row.boundingBox(),
  ]);
  expect(inputBox!.width).toBeCloseTo(rowBox!.width, 1);
  expect(addBox!.y - inputBox!.y - inputBox!.height).toBe(8);
  expect(addBox!.x).toBe(inputBox!.x);
  expect(cancelBox!.y).toBe(addBox!.y);
  expect(cancelBox!.x - addBox!.x - addBox!.width).toBeCloseTo(8, 1);
  expect(addBox!.height).toBe(40);
  expect(cancelBox!.height).toBe(40);
  await expect(add).toBeDisabled();
  await field.fill('   ');
  await field.press('Enter');
  await expect(add).toBeDisabled();
  await field.fill(maya.watchlist[0].name);
  await expect(add).toBeEnabled();
  await field.press('Enter');
  await expect(page.getByRole('status')).toHaveText(
    'Submitted: ' + maya.watchlist[0].name,
  );
  const opener = page.getByRole('button', { name: 'Open form' });
  await expect(opener).toBeFocused();
  await opener.click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(opener).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth))
    .toBe(390);
});

async function tokenColor(element: Locator, name: string) {
  return element.evaluate((element, name) => {
    const probe = document.createElement('span');
    probe.style.color = 'var(' + name + ')';
    element.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, name);
}

test('Toast controls show the approved hover, pressed, and focus states', async ({
  page,
  colorScheme,
}) => {
  await story(page, 'primitives-toast--default', colorScheme!);
  const undo = page.getByRole('button', { name: 'Undo', exact: true });
  const close = page.getByRole('button', { name: 'Close confirmation' });
  const link = await tokenColor(undo, '--color-on-ink-link');
  const muted = await tokenColor(close, '--color-on-ink-muted');
  const onInk = await tokenColor(close, '--color-on-ink');
  await expect(undo).toHaveCSS('color', link);
  await expect(undo).toHaveCSS('text-decoration-line', 'none');
  await expect(close).toHaveCSS('color', muted);
  await undo.hover();
  await expect(undo).toHaveCSS('text-decoration-line', 'underline');
  await expect(undo).toHaveCSS('text-underline-offset', '2px');
  await page.mouse.down();
  await expect(undo).toHaveCSS('text-decoration-line', 'underline');
  await expect(undo).toHaveCSS('color', link);
  await expect(undo).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await close.hover();
  await expect(close).toHaveCSS('color', onInk);
  await page.mouse.down();
  await expect(close).toHaveCSS('color', onInk);
  await expect(close).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.mouse.move(0, 0);
  await page.mouse.up();
  await undo.focus();
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await expect(close).toHaveCSS('outline-style', 'solid');
  await expect(close).toHaveCSS('outline-width', '2px');
  await expect(close).toHaveCSS('outline-offset', '2px');
  for (const id of ['hovered', 'pressed']) {
    await story(page, 'primitives-toast--' + id, colorScheme!);
    await expect(
      page.getByRole('button', { name: 'Undo', exact: true }),
    ).toHaveCSS('text-decoration-line', 'underline');
  }
  for (const id of ['close-hovered', 'close-pressed']) {
    await story(page, 'primitives-toast--' + id, colorScheme!);
    const control = page.getByRole('button', { name: 'Close confirmation' });
    await expect(control).toHaveCSS(
      'color',
      await tokenColor(control, '--color-on-ink'),
    );
  }
});
