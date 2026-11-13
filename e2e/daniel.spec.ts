import type { QA } from '../src/data/types';
import { test, expect } from '@playwright/test';
import daniel from '../src/data/daniel.json' with { type: 'json' };
import {
  chip,
  cleanStart,
  detail,
  exact,
  expectNeeds,
  expectInk,
  field,
  needs,
  pattern,
  progress,
  row,
  simulate,
  source,
  tokenColor,
} from './helpers';

const [checkout, riya, expense, lea] = daniel.items;
const blocked = checkout.judgments[0];
const waiting = checkout.qa[1] as QA;
const clash = lea.judgments[0];

test('Daniel — unblock the team, keep the evening', async ({
  page,
  colorScheme,
}) => {
  await test.step('Daniel 1 · Open and scan: Sees who is waiting on him', async () => {
    await cleanStart(page, 'daniel');
    await expect(
      page.getByText(daniel.coverage.text.replace('{n}', '72'), {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(daniel.coverage.note, { exact: true }),
    ).toBeVisible();
    await expectNeeds(
      page,
      daniel.items.map((item) => item.name),
    );
    await expect(needs(page).getByText('Work', { exact: true })).toHaveCount(0);
    await expect(
      needs(page).getByText('Personal', { exact: true }),
    ).toHaveCount(0);
    const car = daniel.goodToKnow.find((item) => item.account === 'personal')!;
    const personal = page
      .getByRole('list', exact('Good to know'))
      .getByRole('listitem')
      .filter({ hasText: car.title });
    await expect(personal).toContainText(car.title + car.text);
    await expect(personal.getByText('Personal', { exact: true })).toBeVisible();
    await expect(
      needs(page).getByText(
        daniel.doneBefore[0].name + ' · ' + daniel.doneBefore[0].note,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(row(page, checkout.name)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  await test.step('Daniel 2 · Decide: Compares the two options', async () => {
    const decision = detail(page).getByRole(
      'region',
      exact(checkout.scene.label!),
    );
    const [a, b] = checkout.scene.options!;
    for (const option of [a, b]) {
      await expect(
        decision.getByText(option.key, { exact: true }),
      ).toBeVisible();
      await expect(
        decision.getByText(option.title, { exact: true }),
      ).toBeVisible();
      await expect(field(decision, option.value)).toBeVisible();
    }
    const first = await field(decision, a.value).boundingBox();
    const second = await field(decision, b.value).boundingBox();
    expect(first!.x + first!.width).toBeLessThan(second!.x);
    expect(first!.y).toBe(second!.y);
    const urgent = chip(decision, {
      ...checkout.facts[0],
      label: checkout.scene.urgent!,
    });
    await expect(urgent).toBeVisible();
    await expect(urgent).toHaveCSS(
      'background-color',
      await tokenColor(urgent, '--color-urgent'),
    );
    await field(decision, b.value).click();
    await source(
      page,
      checkout,
      checkout.facts.find((fact) => fact.id === b.fact)!.source.hl,
      'time',
    );
  });

  await test.step('Daniel 3 · Understand: Sees what it blocks', async () => {
    await detail(page)
      .getByRole('button', { name: /^Why it’s first:/ })
      .click();
    const reasoning = page.getByRole('region', exact('Glance’s read'));
    await expect(
      reasoning.getByText(blocked.label + ': ' + blocked.why, { exact: true }),
    ).toBeVisible();
    await expect(
      reasoning.getByText(blocked.source!.hl, { exact: true }),
    ).toBeVisible();
    await expectInk(
      reasoning.getByText(blocked.source!.hl, { exact: true }),
      '--color-judgment-ink',
    );
    await expect(
      reasoning.getByText(
        'Based on · ' + blocked.source!.from + ' · ' + blocked.source!.when,
        { exact: true },
      ),
    ).toBeVisible();
  });

  await test.step('Daniel 4 · Ask: Checks the cost of waiting', async () => {
    await page.getByRole('tab', exact('Ask')).click();
    await page.getByRole('button', exact(waiting.q)).click();
    const answer = page.getByRole('region', exact('Answer to ' + waiting.q));
    await expect(answer.getByText(waiting.a, { exact: true })).toBeVisible();
    await expectInk(
      answer.getByText(waiting.source!.hl, { exact: true }),
      '--color-judgment-ink',
    );
    await expect(
      answer.getByText(
        'Based on · ' + waiting.source!.from + ' · ' + waiting.source!.when,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      answer.getByText(waiting.source!.hl, { exact: true }),
    ).toBeVisible();
  });

  await test.step('Daniel 5 · Act and close: Replies; Glance closes it', async () => {
    await simulate(page, daniel.demo.simulate.label);
    await expect(row(page, checkout.name)).toHaveCount(0);
    await expect(
      needs(page).getByText(checkout.name + ' · ' + daniel.demo.simulate.note, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      needs(page).getByRole('button', exact('Undo ' + checkout.name)),
    ).toBeVisible();
    await progress(page, 2, 5);
    await expect(row(page, riya.name)).toHaveAttribute('aria-pressed', 'true');
  });

  await test.step('Daniel 6 · Approve: Approves with the facts in view', async () => {
    await row(page, expense.name).click();
    const approval = detail(page).getByRole(
      'region',
      exact(expense.scene.label!),
    );
    const amount = expense.scene.amount!;
    await expect(field(approval, amount.value, amount.label)).toBeVisible();
    for (const value of expense.scene.fields!) {
      await expect(
        approval.getByText(value.label, { exact: true }),
      ).toBeVisible();
      if (value.fact)
        await expect(field(approval, value.value, value.label)).toBeVisible();
      else
        await expect(
          approval.getByText(value.value, { exact: true }),
        ).toBeVisible();
    }
    await expect(
      approval.getByText(expense.scene.note!, { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', exact('Approve'))).toHaveCount(0);
    await page.getByRole('button', exact('Done')).click();
    await expect(row(page, expense.name)).toHaveCount(0);
    await expect(
      needs(page).getByText(expense.name + ' · marked done in Glance', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      needs(page).getByRole('button', exact('Undo ' + expense.name)),
    ).toBeVisible();
    await progress(page, 3, 5);
  });

  await test.step('Daniel 7 · Connect: Catches a holiday clash', async () => {
    await row(page, lea.name).click();
    const timeOff = detail(page).getByRole('region', exact(lea.scene.label!));
    for (const date of [lea.scene.from!, lea.scene.to!]) {
      await expect(
        timeOff.getByText(date.month, { exact: true }),
      ).toBeVisible();
      await expect(timeOff.getByText(date.day, { exact: true })).toBeVisible();
    }
    const dates = lea.scene.fields![0];
    await expect(field(timeOff, dates.value, dates.label)).toBeVisible();
    await detail(page)
      .getByRole('button', { name: /^Why it’s second:/ })
      .click();
    const reasoning = page.getByRole('region', exact('Glance’s read'));
    await expect(
      reasoning.getByText(
        'Based on · ' + clash.source!.from + ' · ' + clash.source!.when,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      reasoning.getByText(clash.source!.hl, { exact: true }),
    ).toBeVisible();
    await expectInk(
      reasoning.getByText(clash.source!.hl, { exact: true }),
      '--color-judgment-ink',
    );
    expect(clash.source!.from).not.toBe(lea.from);
  });

  await test.step('Daniel 8 · After hours: Work stays at work', async () => {
    await pattern(page, 'quiet-hours', colorScheme ?? 'light');
    await expect(
      page.getByRole('heading', exact('Good evening, Daniel')),
    ).toBeVisible();
    await expect(
      page.getByText('Personal inbox only.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Quiet hours until 8:00 AM', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', exact('Nothing personal needs you tonight')),
    ).toBeVisible();
    await expect(
      page.getByText(
        '12 work emails arrived after 7:00 PM. They’ll be in tomorrow’s brief at 8:00 AM.',
        { exact: true },
      ),
    ).toBeVisible();
    const show = page.getByRole('button', exact('Show work email anyway'));
    await expect(show).not.toHaveCSS(
      'background-color',
      await tokenColor(show, '--color-brand'),
    );
    await show.click();
    await expect(
      page.getByText('Personal inbox only.', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', exact('Good to know 1')),
    ).toBeVisible();
    await expect(
      page.getByText(
        daniel.goodToKnow.find((item) => item.account === 'personal')!.title,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: /^3 set aside/ }),
    ).toBeVisible();
    for (const name of [
      ...daniel.items.map((item) => item.name),
      ...daniel.goodToKnow
        .filter((item) => item.account !== 'personal')
        .map((item) => item.title),
    ]) {
      await expect(page.getByText(name, { exact: true })).toHaveCount(0);
    }
  });
});
