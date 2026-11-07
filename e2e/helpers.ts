import { expect, type Locator, type Page } from '@playwright/test';

export const exact = (name: string) => ({ name, exact: true });
export const needs = (page: Page) => page.getByRole('list', exact('Needs you'));
export const detail = (page: Page) =>
  page.getByRole('region', exact('Selected item'));

export function row(page: Page, name: string) {
  return needs(page)
    .getByRole('button')
    .filter({ has: page.getByText(name, { exact: true }) });
}

export async function expectNeeds(page: Page, names: string[]) {
  await expect(
    page.getByRole('heading', exact('Needs you ' + names.length)),
  ).toBeVisible();
  const buttons = needs(page).getByRole('button', { name: /^\d+\s/ });
  await expect(buttons).toHaveCount(names.length);
  for (const [index, name] of names.entries()) {
    await expect(buttons.nth(index)).toContainText(name);
    await expect(buttons.nth(index)).toHaveAccessibleName(
      new RegExp('^' + (index + 1) + '\\s'),
    );
  }
}

export async function progress(page: Page, done: number, total: number) {
  await expect(page.getByRole('status', exact('Brief progress'))).toHaveText(
    done + ' of ' + total + ' done',
  );
}

export async function simulate(page: Page, label: string) {
  const trigger = page.getByRole('button', exact('Demo'));
  if (await trigger.count()) {
    if ((await trigger.getAttribute('aria-expanded')) === 'false')
      await trigger.click();
  }
  await page.getByRole('button', exact(label)).click();
}

export async function cleanStart(page: Page, persona: string) {
  await page.goto('/glance-mail/?persona=' + persona + '&start=clean');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('region', { name: /^Source from / })).toHaveCount(
    0,
  );
  await expect(page.getByRole('region', exact('Glance’s read'))).toHaveCount(0);
}

export function field(scope: Locator, value: string, label?: string) {
  return scope.getByRole(
    'button',
    exact(
      (label ? label + ': ' : '') + value + '. Show where the email says so',
    ),
  );
}

export function chip(
  scope: Locator,
  fact: { kind: string; label: string; urgent: boolean },
) {
  return scope.getByText(
    fact.kind + ': ' + fact.label + (fact.urgent ? ', urgent' : ''),
    { exact: true },
  );
}

export async function tokenColor(element: Locator, name: string) {
  const value = await element.evaluate(
    (el, token) => getComputedStyle(el).getPropertyValue(token).trim(),
    name,
  );
  expect(value).toMatch(/^#[\da-f]{6}$/i);
  return (
    'rgb(' +
    [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)).join(', ') +
    ')'
  );
}

export async function expectInk(element: Locator, token: string) {
  const color = await tokenColor(element, token);
  await expect(element).toHaveCSS(
    'background-image',
    'linear-gradient(' + color + ', ' + color + ')',
  );
}

export async function primary(scope: Page | Locator, action: Locator) {
  const color = await tokenColor(action, '--color-brand');
  await expect(action).toHaveCSS('background-color', color);
  const controls = scope.getByRole('button').or(scope.getByRole('link'));
  await expect
    .poll(async () =>
      controls.evaluateAll(
        (elements, background) =>
          elements.filter(
            (el) =>
              el.getClientRects().length &&
              getComputedStyle(el).backgroundColor === background,
          ).length,
        color,
      ),
    )
    .toBe(1);
}

export async function source(
  page: Page,
  item: { from: string; when: string },
  highlight: string,
  kind: 'money' | 'time' | 'people',
) {
  const panel = page.getByRole('region', exact('Source from ' + item.from));
  await expect(
    panel.getByText('Source · ' + item.from + ' · ' + item.when, {
      exact: true,
    }),
  ).toBeVisible();
  await expect(panel.getByText(highlight, { exact: true })).toBeVisible();
  await expectInk(
    panel.getByText(highlight, { exact: true }),
    '--color-' + kind + '-ink',
  );
  return panel;
}

export async function pattern(page: Page, name: string, colorScheme: string) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    'http://127.0.0.1:6196/iframe.html?id=patterns-edge-states--' +
      name +
      '&viewMode=story&globals=theme:' +
      colorScheme,
  );
}
