import { test, expect } from '@playwright/test';
import sarah from '../src/data/sarah.json' with { type: 'json' };
import {
  chip,
  cleanStart,
  detail,
  exact,
  expectNeeds,
  expectProductFits,
  expectInk,
  field,
  needs,
  pattern,
  primary,
  progress,
  row,
  simulate,
  source,
  tokenColor,
} from './helpers';

const [lincoln, riverside, water] = sarah.items;
const steps = lincoln.scene.steps!;
const stepNames = steps.map((step) => step.pre + (step.value ?? ''));
const fee = lincoln.facts.find((fact) => fact.id === steps[1].fact)!;

test.use({ viewport: { width: 390, height: 844 } });

test('Sarah — clear the family’s to-dos before getting up', async ({
  page,
  colorScheme,
}) => {
  await test.step('Sarah 1 · Wake and scan: Sees what Ella needs', async () => {
    await cleanStart(page, 'sarah');
    await expect(
      page.getByText(sarah.coverage.text.replace('{n}', '23'), { exact: true }),
    ).toBeVisible();
    await expectNeeds(
      page,
      sarah.items.map((item) => item.name),
    );
    await expect(
      row(page, lincoln.name).getByText('Family', { exact: true }),
    ).toBeVisible();
    for (const item of [riverside, water]) {
      await expect(
        row(page, item.name).getByText('Family', { exact: true }),
      ).toHaveCount(0);
      await expect(
        row(page, item.name).getByText('Personal', { exact: true }),
      ).toHaveCount(0);
    }
    await expect(row(page, lincoln.name)).toContainText(lincoln.request.text);
    await expect(
      row(page, lincoln.name).getByRole('img', exact('Glance’s summary')),
    ).toBeVisible();
    const urgent = chip(row(page, lincoln.name), lincoln.facts[0]);
    await expect(urgent).toHaveCSS(
      'background-color',
      await tokenColor(urgent, '--color-urgent'),
    );
    await expectProductFits(
      page,
      page.getByRole('button', { name: /^18 set aside/ }),
    );
  });

  await test.step('Sarah 2 · Verify: Checks the fee', async () => {
    await row(page, lincoln.name).click();
    const sheet = page.getByRole('dialog', exact(lincoln.name));
    await expect(sheet).toBeVisible();
    await expect(
      sheet.getByText('Needs you · 1 of 3', { exact: true }),
    ).toBeVisible();
    const todo = sheet.getByRole('region', exact(lincoln.scene.label!));
    for (const name of stepNames)
      await expect(todo.getByRole('checkbox', exact(name))).toBeVisible();
    for (const value of lincoln.scene.fields!)
      await expect(field(todo, value.value, value.label)).toBeVisible();
    await field(todo, steps[1].value!).click();
    const panel = await source(page, lincoln, fee.source.hl, 'money');
    await expect(panel.getByText(fee.source.hl, { exact: true })).toHaveCSS(
      'background-image',
      new RegExp('linear-gradient'),
    );
    await panel.scrollIntoViewIfNeeded();
    const sourceBox = await panel.boundingBox();
    const actionBox = await sheet
      .getByRole('link', exact('Open in Yahoo Mail'))
      .boundingBox();
    expect
      .soft(sourceBox!.y + sourceBox!.height)
      .toBeLessThanOrEqual(actionBox!.y);
  });

  await test.step('Sarah 3 · Read the original: Finds how to pay', async () => {
    await page.getByRole('tab', exact('Original email')).click();
    const email = page.getByRole('region', exact('Original email'));
    await expect(
      email.getByRole('heading', exact(lincoln.email.subject)),
    ).toBeVisible();
    await expect(
      email.getByText(lincoln.email.from + ' · ' + lincoln.when + ' · Family', {
        exact: true,
      }),
    ).toBeVisible();
    const highlights = lincoln.email.paras
      .flat()
      .filter((segment) => typeof segment !== 'string');
    for (const segment of highlights) {
      await expect(email.getByText(segment.t, { exact: true })).toBeVisible();
      await expectInk(
        email.getByText(segment.t, { exact: true }),
        '--color-' +
          (segment.kind === 'judg' ? 'judgment' : segment.kind) +
          '-ink',
      );
      await expect(email.getByText(segment.t, { exact: true })).toHaveCSS(
        'background-size',
        '100% 100%',
      );
    }
    await expect(email.getByRole('switch', exact('Highlighter'))).toBeChecked();
    const payment = lincoln.email.paras
      .flat()
      .find(
        (segment) =>
          typeof segment === 'string' && segment.includes('parent portal'),
      ) as string;
    const plain = email.getByText(payment, { exact: true });
    await expect(plain).toBeVisible();
    await expect(plain).toHaveCSS('background-image', 'none');
  });

  await test.step('Sarah 4 · Act: Ticks both steps', async () => {
    await page.getByRole('tab', exact('Details')).click();
    const todo = detail(page).getByRole('region', exact(lincoln.scene.label!));
    for (const name of stepNames)
      await todo.getByRole('checkbox', exact(name)).check();
    for (const name of stepNames)
      await expect(todo.getByText(name, { exact: true })).toHaveCSS(
        'text-decoration-line',
        'line-through',
      );
    const amount = field(todo, steps[1].value!);
    await expect(amount).toHaveCSS('text-decoration-line', 'underline');
    // The source from step 2 is still open after returning to Details.
    await expect(amount).toHaveAttribute('aria-expanded', 'true');
    await amount.click();
    await expect(
      page.getByRole('region', exact('Source from ' + lincoln.from)),
    ).toHaveCount(0);
    await amount.click();
    await expect(
      page.getByRole('region', exact('Source from ' + lincoln.from)),
    ).toBeVisible();
    await page.getByRole('button', exact('Close source')).click();
    await expect(
      page.getByText(lincoln.scene.doneNote!, { exact: true }),
    ).toBeVisible();
    const done = detail(page).getByRole('button', exact('Mark done'));
    await primary(page, done);
    const width = await done.evaluate((el) => {
      const parent = el.parentElement!;
      const style = getComputedStyle(parent);
      return (
        parent.clientWidth -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight)
      );
    });
    expect((await done.boundingBox())!.width).toBeCloseTo(width, 0);
    const open = detail(page).getByRole('link', exact('Open in Yahoo Mail'));
    await expect(open).toHaveCSS(
      'background-color',
      await tokenColor(open, '--color-surface-sunken'),
    );
    await expect(page.getByRole('button', exact('Snooze'))).toHaveCount(0);
    await expect(page.getByRole('dialog', exact(lincoln.name))).toBeVisible();
    await expect(
      page.getByText('Needs you · 1 of 3', { exact: true }),
    ).toBeVisible();
    await todo.getByRole('checkbox', exact(stepNames[0])).uncheck();
    await primary(page, open);
    for (const name of ['Ask', 'Snooze', 'Done'])
      await expect(detail(page).getByRole('button', exact(name))).toBeVisible();
  });

  await test.step('Sarah 5 · Close: Two of three done', async () => {
    await detail(page).getByRole('checkbox', exact(stepNames[0])).check();
    await detail(page).getByRole('button', exact('Mark done')).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(row(page, lincoln.name)).toHaveCount(0);
    await simulate(page, sarah.demo.simulate.label);
    await expectNeeds(page, [water.name]);
    await progress(page, 2, 3);
    await expect(
      needs(page).getByText(lincoln.name + ' · marked done in Glance', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      needs(page).getByText(riverside.name + ' · ' + sarah.demo.simulate.note, {
        exact: true,
      }),
    ).toBeVisible();
    for (const item of [lincoln, riverside])
      await expect(
        needs(page).getByRole('button', exact('Undo ' + item.name)),
      ).toBeVisible();
  });

  await test.step('Sarah 6 · Branch · If an inbox drops out: The brief says what’s missing', async () => {
    await pattern(page, 'disconnected', colorScheme ?? 'light');
    await expect(
      page.getByText('11 emails overnight from 1 of your 2 inboxes.', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', exact('Yahoo Mail (Family) is disconnected')),
    ).toBeVisible();
    const reconnect = page.getByRole('button', exact('Reconnect Yahoo Mail'));
    await primary(page, reconnect);
    await expect(page.getByRole('heading', exact('Needs you 2'))).toBeVisible();
    await expect(
      page
        .getByRole('region', exact('Needs you 2'))
        .getByText('From Gmail only', { exact: true }),
    ).toBeVisible();
    await expect(page.getByText(lincoln.name, { exact: true })).toHaveCount(0);
    await reconnect.click();
    await expect(
      page.getByText('11 emails overnight from 1 of your 2 inboxes.', {
        exact: true,
      }),
    ).toBeVisible();
  });

  await test.step('Sarah 7 · Branch · After a week away: Still one screen', async () => {
    await pattern(page, 'overload', colorScheme ?? 'light');
    await expect(
      page.getByText('Monday, November 16', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', exact('Welcome back, Sarah')),
    ).toBeVisible();
    await expect(
      page.getByText('236 emails from 2 inboxes since Nov 7.', { exact: true }),
    ).toBeVisible();
    const section = page.getByRole('region', exact('Needs you 12'));
    await expect(
      section.getByText('Top 4 shown', { exact: true }),
    ).toBeVisible();
    const rows = section.getByRole('listitem');
    await expect(rows).toHaveCount(5);
    await expect(rows.first()).toContainText(water.name);
    await expect(rows.first()).toContainText('Overdue 4 days');
    await expect(
      rows.nth(4).getByRole('button', { name: /Show 8 more/ }),
    ).toBeVisible();
    await expect(
      rows
        .nth(4)
        .getByText('Ranked the same way, most urgent first', { exact: true }),
    ).toBeVisible();
    await expectProductFits(page, section);
  });
});
