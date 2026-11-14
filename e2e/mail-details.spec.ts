import { test, expect, type Page } from '@playwright/test';
import maya from '../src/data/maya.json' with { type: 'json' };
async function story(page: Page, id: string, theme: string) {
  await page.goto(
    'http://127.0.0.1:6196/iframe.html?id=' +
      id +
      '&viewMode=story&globals=theme:' +
      theme,
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as unknown as {
              __STORYBOOK_PREVIEW__?: {
                currentRender?: {
                  channel: {
                    last: (name: string) => { status?: string }[] | undefined;
                  };
                };
              };
            }
          ).__STORYBOOK_PREVIEW__?.currentRender?.channel.last(
            'storyFinished',
          )?.[0]?.status,
      ),
    )
    .toBe('success');
  await expect(page.locator('.sb-errordisplay')).not.toBeVisible();
}
const prefix = 'composites-mail-rows-and-details--';
test('Heads-up rows expose real sources, reasoning, email, and account labels', async ({
  page,
  colorScheme,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await story(page, prefix + 'sources-and-read', colorScheme!);
    const details = page.getByRole('tab', { name: 'Details', exact: true });
    if (width === 390) {
      await expect(details).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(details).toHaveCSS('min-height', '44px');
    }
    await story(page, prefix + 'daniel-personal', colorScheme!);
    const row = page
      .getByRole('list', { name: 'Heads-up' })
      .getByRole('button', { name: /Car service/ });
    await expect(row).toContainText('Personal');
    await row.click();
    await expect(
      page.getByRole('link', { name: 'Open in Gmail' }),
    ).toBeVisible();
    await expect(
      page.getByRole('region', { name: /Source from Hillside Auto/ }),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'Close source' }),
    ).toHaveCount(0);
    if (width === 390) {
      await page.getByRole('button', { name: 'Close detail' }).click();
      await expect(row).toBeFocused();
    }
  }
});
test('Other mail renders only its actual highlight legend and remaining count', async ({
  page,
  colorScheme,
}) => {
  await story(page, prefix + 'maya-other-mail', colorScheme!);
  const list = page.getByRole('list', { name: 'Other mail' });
  await expect(list.getByRole('listitem')).toHaveCount(4);
  await expect(page.getByText('27 more like these')).toBeVisible();
  for (const item of maya.otherMail.rows.filter((row) => !row.isNew)) {
    await list
      .getByRole('button', {
        name: new RegExp(item.sender.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
      })
      .click();
    await expect(
      page.getByRole('heading', { name: item.subject, exact: true }),
    ).toBeVisible();
    const legend = page.getByLabel('Highlight legend');
    const kinds = new Set(
      item.paras
        .flat()
        .filter((s) => typeof s !== 'string')
        .map((s) => (typeof s === 'string' ? '' : s.kind)),
    );
    await expect(legend.getByText('Highlighted', { exact: true })).toHaveCount(
      kinds.has('judg') ? 1 : 0,
    );
    await expect(legend.getByText('Amounts', { exact: true })).toHaveCount(
      kinds.has('money') ? 1 : 0,
    );
    await expect(legend.getByText(/^[Dd]ates$/)).toHaveCount(
      kinds.has('time') ? 1 : 0,
    );
    await expect(page.getByRole('tablist')).toHaveCount(0);
  }
  await story(page, 'composites-maillist--zero-remaining', colorScheme!);
  await expect(page.getByText(/more like these/)).toHaveCount(0);
  await story(page, prefix + 'judgment-only', colorScheme!);
  await expect(page.getByLabel('Highlight legend')).toHaveText(
    'Highlighted what Glance used to sort it.',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await story(page, prefix + 'phone-other-mail', colorScheme!);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByLabel('Highlight legend')).toContainText(
    'Amounts and dates',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
test('Moved rows and details preserve origin content across all destinations', async ({
  page,
  colorScheme,
}) => {
  await story(page, prefix + 'moved-matrix', colorScheme!);
  await expect(page.getByRole('listitem')).toHaveCount(9);
  await expect(page.getByText('Moved by you', { exact: true })).toHaveCount(9);
  await expect(page.locator('mark')).toHaveCount(0);
  for (const id of [
    'moved-into-needs-you',
    'moved-into-heads-up',
    'moved-into-other-mail',
  ]) {
    await story(page, prefix + id, colorScheme!);
    await expect(
      page.getByText(
        'You moved this here. Glance will sort emails like it the same way.',
      ),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Why it’s/ })).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: 'Open in Outlook' }),
    ).toBeVisible();
  }
  await story(page, prefix + 'empty', colorScheme!);
  await expect(page.getByText('Nothing here.', { exact: true })).toHaveCount(2);
  await expect(
    page.getByRole('heading', { name: 'Nothing else needs you today' }),
  ).toBeVisible();
});
