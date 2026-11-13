import type { QA } from '../src/data/types';
import { test, expect } from '@playwright/test';
import maya from '../src/data/maya.json' with { type: 'json' };
import {
  chip,
  cleanStart,
  detail,
  exact,
  expectNeeds,
  expectInk,
  field,
  needs,
  primary,
  progress,
  row,
  simulate,
  source,
  tokenColor,
} from './helpers';

const [fernway, brightline, halden, okto] = maya.items;
const contract = fernway.scene.fields![0];
const contractFact = fernway.facts.find((fact) => fact.id === contract.fact)!;
const risk = fernway.judgments[0];
const discount = fernway.qa[2] as QA;
const notFound = fernway.qa[0];
const newsletter = maya.setAside[0].rows.find((entry) => !entry.isNew)!;

test('Maya — protect a renewal before Friday', async ({
  page,
  context,
  reducedMotion,
}) => {
  await test.step('Maya 1 · Open and scan: Sees what can’t wait', async () => {
    await cleanStart(page, 'maya');
    await expect(
      page.getByText(maya.coverage.text.replace('{n}', '38'), { exact: true }),
    ).toBeVisible();
    await expectNeeds(page, [fernway.name, brightline.name, halden.name]);
    for (const fact of fernway.facts.slice(0, 2))
      await expect(chip(row(page, fernway.name), fact)).toBeVisible();
    const urgent = chip(row(page, fernway.name), fernway.facts[0]);
    await expect(urgent).toHaveCSS(
      'background-color',
      await tokenColor(urgent, '--color-urgent'),
    );
    await progress(page, 1, 4);
    await expect(
      needs(page).getByText(
        maya.doneBefore[0].name + ' · ' + maya.doneBefore[0].note,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(row(page, fernway.name)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(
      detail(page).getByRole('region', exact(fernway.scene.label!)),
    ).toBeVisible();
  });

  await test.step('Maya 2 · Verify: Checks the contract value', async () => {
    const value = field(detail(page), contract.value, contract.label);
    await value.click();
    await expect(value).toHaveAttribute('aria-expanded', 'true');
    await expect(value).toHaveCSS(
      'background-color',
      await tokenColor(value, '--color-money-ink'),
    );
    await source(page, fernway, contractFact.source.hl, 'money');
    await value.click();
    await expect(
      page.getByRole('region', exact('Source from ' + fernway.from)),
    ).toHaveCount(0);
    await value.click();
    await page.getByRole('button', exact('Close source')).click();
    await expect(
      page.getByRole('region', exact('Source from ' + fernway.from)),
    ).toHaveCount(0);
  });

  await test.step('Maya 3 · Understand: Learns why it’s at risk', async () => {
    await detail(page)
      .getByRole('button', { name: /^Why it’s first:/ })
      .click();
    const reasoning = page.getByRole('region', exact('Glance’s read'));
    await expect(
      reasoning.getByText('Glance’s reasoning · not stated in the email', {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      reasoning.getByText('Why 1st: ' + fernway.rank, { exact: true }),
    ).toBeVisible();
    await expect(
      reasoning.getByText(risk.label + ': ' + risk.why, { exact: true }),
    ).toBeVisible();
    await expect(
      reasoning.getByText(risk.source!.hl, { exact: true }),
    ).toHaveText(risk.source!.hl);
    await expect(
      reasoning.getByText(
        'Based on · ' + risk.source!.from + ' · ' + risk.source!.when,
        { exact: true },
      ),
    ).toBeVisible();
    const ink = reasoning.getByText(risk.source!.hl, { exact: true });
    await expectInk(ink, '--color-judgment-ink');
    await expect(
      detail(page).getByRole('region', exact(fernway.scene.label!)),
    ).not.toContainText(risk.label);
    await expect(
      detail(page).getByRole('region', exact(fernway.scene.label!)),
    ).not.toContainText(fernway.rank);
    await expect(
      reasoning.getByText(
        'Not for you? Glance will rank emails like this lower.',
        { exact: true },
      ),
    ).toHaveCount(0);
    await expect(
      reasoning.getByRole('button', exact('Move to Set aside')),
    ).toHaveCount(0);
  });

  await test.step('Maya 4 · Ask: Confirms the discount', async () => {
    await page.getByRole('tab', exact('Ask')).click();
    const ask = page.getByRole('region', exact('Ask Glance'));
    await ask.getByRole('button', exact(discount.q)).click();
    const answer = ask.getByRole('region', exact('Answer to ' + discount.q));
    await expect(answer.getByText(discount.a, { exact: true })).toBeVisible();
    await expect(answer.getByText('Glance', { exact: true })).toBeVisible();
    await expect(
      answer.getByText(
        'Based on · ' + discount.source!.from + ' · ' + discount.source!.when,
        { exact: true },
      ),
    ).toBeVisible();
    await expect(ask.getByRole('button', exact(discount.q))).toHaveCount(0);
    await ask.getByRole('button', exact(notFound.q)).click();
    const missing = ask.getByRole('region', exact('Answer to ' + notFound.q));
    await expect(
      missing.getByRole('heading', exact('Not in your email')),
    ).toBeVisible();
    await expect(missing.getByText(notFound.a, { exact: true })).toBeVisible();
    await expect(missing.getByText(/^Based on/)).toHaveCount(0);
  });

  await test.step('Maya 5 · Act: Replies in Outlook', async () => {
    await page.getByRole('tab', exact('Original email')).click();
    const email = page.getByRole('region', exact('Original email'));
    await expect(
      email.getByRole('heading', exact(fernway.email.subject)),
    ).toBeVisible();
    await expect(
      email.getByRole('list', exact('Highlight legend')).getByRole('listitem'),
    ).toHaveText(['Money', 'Time', 'People', 'Glance’s read']);
    const highlights = fernway.email.paras
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
    const highlighter = email.getByRole('switch', exact('Highlighter'));
    await expect(highlighter).toBeChecked();
    await highlighter.uncheck();
    await expect(email.getByText(highlights[0].t, { exact: true })).toHaveCSS(
      'background-size',
      '0% 100%',
    );
    await highlighter.check();
    await expect(email.getByText(highlights[0].t, { exact: true })).toHaveCSS(
      'background-size',
      '100% 100%',
    );
    const open = detail(page).getByRole('link', exact('Open in Outlook'));
    await primary(page, open);
    await context.route('https://outlook.office.com/mail/**', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<title>Inbox destination</title>',
      }),
    );
    const popupPromise = context.waitForEvent('page');
    await open.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL('https://outlook.office.com/mail/');
    await popup.close();
  });

  await test.step('Maya 6 · Close: Glance notices the reply', async () => {
    const duration = await row(page, fernway.name).evaluate((el) =>
      getComputedStyle(el).getPropertyValue('--duration-collapse').trim(),
    );
    expect(parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000)).toBe(
      reducedMotion === 'reduce' ? 1 : 320,
    );
    await simulate(page, maya.demo.simulate.label);
    await expect(row(page, fernway.name)).toHaveCount(0);
    await expect(
      needs(page).getByText(fernway.name + ' · ' + maya.demo.simulate.note, {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      needs(page).getByRole('button', exact('Undo ' + fernway.name)),
    ).toBeVisible();
    await progress(page, 2, 4);
    await expect(row(page, brightline.name)).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await needs(page)
      .getByRole('button', exact('Undo ' + fernway.name))
      .click();
    await expectNeeds(page, [fernway.name, brightline.name, halden.name]);
    await progress(page, 1, 4);
  });

  await test.step('Maya 7 · Return: Adds new mail on her terms', async () => {
    // Step 6 exercises Undo; restore this step's documented Given through the UI.
    await simulate(page, maya.demo.simulate.label);
    await expect(row(page, fernway.name)).toHaveCount(0);
    await expect(needs(page).getByRole('listitem').first()).toContainText(
      maya.newMail!.label,
    );
    await expectNeeds(page, [brightline.name, halden.name]);
    await page.getByRole('button', exact('Add to brief')).click();
    await expect(needs(page).getByRole('listitem').first()).toContainText(
      maya.newMail!.added,
    );
    await expectNeeds(page, [brightline.name, halden.name, okto.name]);
    await expect(
      row(page, okto.name).getByText('New', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText(maya.coverage.text.replace('{n}', '40'), { exact: true }),
    ).toBeVisible();
    await progress(page, 2, 5);
    await row(page, okto.name).click();
    const invoice = detail(page).getByRole('region', exact(okto.scene.label!));
    for (const value of okto.scene.compare!)
      await expect(field(invoice, value.value, value.label)).toBeVisible();
    await expect(
      invoice.getByRole('img', exact('does not match')),
    ).toBeVisible();
    const due = okto.scene.fields![0];
    await expect(field(invoice, due.value, due.label)).toBeVisible();
    await expectNeeds(page, [brightline.name, halden.name, okto.name]);
  });

  await test.step('Maya 8 · Tidy: Keeps one newsletter', async () => {
    await page.getByRole('button', { name: /^32 set aside/ }).click();
    const aside = page.getByRole('region', exact('Set aside view'));
    await expect(
      aside.getByRole('heading', exact('Set aside 32')),
    ).toBeVisible();
    await expect(
      aside.getByRole('heading', exact('Newsletters 19')),
    ).toBeVisible();
    await aside
      .getByRole('button', exact('Show in brief: ' + newsletter.title))
      .click();
    const kept = aside
      .getByRole('listitem')
      .filter({ has: page.getByText(newsletter.title, { exact: true }) });
    await expect(kept).toContainText('In Good to know');
    await expect(
      kept.getByRole(
        'button',
        exact('Undo Show in brief: ' + newsletter.title),
      ),
    ).toBeVisible();
    await expect(
      aside.getByRole('heading', exact('Set aside 31')),
    ).toBeVisible();
    await expect(
      aside.getByRole('heading', exact('Newsletters 18')),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', exact('Good to know 4')),
    ).toBeVisible();
    const last = page
      .getByRole('list', exact('Good to know'))
      .getByRole('listitem')
      .last();
    await expect(last).toContainText(newsletter.title + ': ' + newsletter.sub);
    await expect(last).toContainText('Moved by you');
    await expectNeeds(page, [brightline.name, halden.name, okto.name]);
    await progress(page, 2, 5);
    await expect(
      page.getByText(
        maya.coverage.text.replace('{n}', String(3 + 4 + 31 + 2)),
        { exact: true },
      ),
    ).toBeVisible();
  });
});
