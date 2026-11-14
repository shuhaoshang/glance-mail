import { expect, test } from '@playwright/test';
import maya from '../src/data/maya.json' with { type: 'json' };
import daniel from '../src/data/daniel.json' with { type: 'json' };
import sarah from '../src/data/sarah.json' with { type: 'json' };
import { cleanStart } from './helpers';

const personas = [maya, daniel, sarah];

test('Level 2 uses the version 2 names for all three personas', async ({
  page,
}) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const persona of personas) {
      await test.step(persona.name + ' at ' + width, async () => {
        await cleanStart(page, persona.id);
        const demo = page.getByRole('button', { name: 'Demo', exact: true });
        if (await demo.count()) await demo.click();
        await page
          .getByRole('button', { name: '2 Formatted', exact: true })
          .click();
        if (await demo.count()) await demo.click();
        const formatted = page.getByRole('region', {
          name: 'Brief as formatted text',
        });
        await expect(
          formatted.getByRole('heading', { name: 'Heads-up', exact: true }),
        ).toBeVisible();
        await expect(
          formatted.getByRole('heading', { name: 'Good to know', exact: true }),
        ).toHaveCount(0);
        await expect(
          formatted.getByText(persona.demo.levels.l2.otherMail, {
            exact: true,
          }),
        ).toBeVisible();
        await expect(formatted).not.toContainText('set aside');
        await expect(
          formatted.getByRole('list').first().getByRole('listitem'),
        ).toHaveCount(persona.demo.levels.l2.needs.length);
      });
    }
  }
});
