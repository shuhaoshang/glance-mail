import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DemoApp } from '../demo/DemoApp';
import { getPersona } from '../data';
const meta = {
  title: 'Patterns/Set aside',
  component: DemoApp,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { initialPersonaId: 'maya' },
} satisfies Meta<typeof DemoApp>;
export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];
const summary = (canvas: Canvas) =>
  canvas.getByRole('button', { name: /^\d+ set aside/ });
async function open(canvas: Canvas) {
  await userEvent.click(summary(canvas));
  await expect(summary(canvas)).toHaveAttribute('aria-pressed', 'true');
  return within(canvas.getByRole('region', { name: 'Set aside view' }));
}
async function back(canvas: Canvas) {
  const dialog = canvas.queryByRole('dialog');
  await userEvent.click(
    dialog
      ? within(dialog).getByRole('button', { name: 'Close Set aside' })
      : canvas.getByRole('button', { name: 'Back to brief' }),
  );
  await waitFor(async () => {
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  });
}
async function counts(
  canvas: Canvas,
  needs: number,
  know: number,
  aside: number,
  done: number,
  total: number,
) {
  await waitFor(async () => {
    await expect(
      canvas.getByRole('heading', {
        name: new RegExp('^Needs you\\s+' + needs + '$'),
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('heading', {
        name: new RegExp('^Good to know\\s+' + know + '$'),
      }),
    ).toBeVisible();
    await expect(summary(canvas)).toHaveTextContent(aside + ' set aside');
    await expect(
      canvas.getByText(
        new RegExp('^' + (needs + know + aside + done) + ' emails overnight'),
      ),
    ).toBeVisible();
    await expect(
      canvas.getByRole('status', { name: 'Brief progress' }),
    ).toHaveTextContent(done + ' of ' + total + ' done');
  });
}
const ready: NonNullable<Story['play']> = async ({ canvasElement }) => {
  await Promise.all(
    canvasElement
      .getAnimations({ subtree: true })
      .map((a) => a.finished.catch(() => {})),
  );
  canvasElement.dataset.asideReady = 'true';
};
const basic: NonNullable<Story['play']> = async (context) => {
  const { canvas, args } = context;
  const persona = getPersona(args.initialPersonaId ?? 'maya');
  const group = persona.setAside[0];
  const row = group.rows.find((row) => !row.isNew)!;
  const panel = await open(canvas);
  const category = within(panel.getByRole('region', { name: group.title }));
  const hidden = group.count - group.rows.filter((row) => !row.isNew).length;
  await expect(
    category.getByText('+' + hidden + ' more', { exact: true }),
  ).toBeVisible();
  await userEvent.click(
    panel.getByRole('button', { name: 'Show in brief: ' + row.title }),
  );
  await expect(
    category.getByRole('button', { name: 'Undo Show in brief: ' + row.title }),
  ).toHaveFocus();
  await expect(
    category.getByText('+' + hidden + ' more', { exact: true }),
  ).toBeVisible();
  const aside = persona.setAside.reduce((n, g) => n + g.count, 0);
  await counts(
    canvas,
    persona.items.filter((i) => !i.isNew).length,
    persona.goodToKnow.length + 1,
    aside - 1,
    persona.doneBefore.length,
    persona.items.filter((i) => !i.isNew).length + persona.doneBefore.length,
  );
  await waitFor(async () => {
    await expect(
      within(canvas.getByRole('list', { name: 'Good to know' })).getByText(
        row.title,
        { exact: true },
      ),
    ).toBeVisible();
  });
  await userEvent.click(
    panel.getByRole('button', { name: 'Undo Show in brief: ' + row.title }),
  );
  await counts(
    canvas,
    persona.items.filter((i) => !i.isNew).length,
    persona.goodToKnow.length,
    aside,
    persona.doneBefore.length,
    persona.items.filter((i) => !i.isNew).length + persona.doneBefore.length,
  );
  await back(canvas);
  await expect(summary(canvas)).toHaveFocus();
};
export const Maya: Story = { play: basic };
export const Daniel: Story = {
  args: { initialPersonaId: 'daniel' },
  play: basic,
};
export const Sarah: Story = {
  args: { initialPersonaId: 'sarah' },
  play: basic,
};
export const MayaFlow: Story = {
  play: async (context) => {
    const { canvas } = context;
    const demo = canvas.queryByRole('button', { name: /^Demo$/ });
    if (demo) await userEvent.click(demo);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Simulate reply to Priya' }),
    );
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: 'Undo Fernway Logistics' }),
      ).toBeVisible();
    });
    await counts(canvas, 2, 3, 31, 2, 4);
    await expect(
      canvas.queryByRole('button', { name: /Okto Freight/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Add to brief' }));
    await counts(canvas, 3, 3, 32, 2, 5);
    await expect(
      canvas.getByText('40 emails overnight, all in Outlook.', { exact: true }),
    ).toBeVisible();
    const rows = canvas
      .getByRole('list', { name: 'Needs you' })
      .querySelectorAll<HTMLButtonElement>('[data-brief-item]');
    await expect(Array.from(rows).map((r) => r.dataset.briefItem)).toEqual([
      'brightline',
      'halden',
      'okto',
    ]);
    await expect(rows[2]).toHaveTextContent('New');
    const panel = await open(canvas);
    await expect(
      panel.getByRole('heading', { name: 'Newsletters 19' }),
    ).toBeVisible();
    await userEvent.click(
      panel.getByRole('button', { name: 'Show in brief: SaaS Sales Weekly' }),
    );
    await counts(canvas, 3, 4, 31, 2, 5);
    await expect(
      panel.getByRole('heading', { name: 'Newsletters 18' }),
    ).toBeVisible();
    await expect(
      within(panel.getByRole('region', { name: 'Newsletters' })).getByText(
        '+16 more',
        { exact: true },
      ),
    ).toBeVisible();
    await userEvent.click(
      panel.getByRole('button', {
        name: 'Undo Show in brief: SaaS Sales Weekly',
      }),
    );
    await counts(canvas, 3, 3, 32, 2, 5);
    await back(canvas);
    await expect(
      canvas.queryByRole('button', { name: 'Add to brief' }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Fernway Logistics' }),
    );
    await counts(canvas, 4, 3, 32, 1, 5);
    await expect(
      Array.from(
        canvas
          .getByRole('list', { name: 'Needs you' })
          .querySelectorAll<HTMLButtonElement>('[data-brief-item]'),
      ).map((r) => r.dataset.briefItem),
    ).toEqual(['fernway', 'brightline', 'halden', 'okto']);
  },
};
export const Correction: Story = {
  play: async (context) => {
    const { canvas } = context;
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
        'button',
        { name: /Halden Health/ },
      ),
    );
    const read = canvas.getByRole('button', { name: /Glance’s read:/ });
    if (read.getAttribute('aria-expanded') !== 'true')
      await userEvent.click(read);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Move to Set aside' }),
    );
    await waitFor(async () => {
      await expect(
        canvas.getByRole('button', { name: 'Undo Halden Health' }),
      ).toBeVisible();
      await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
    });
    await counts(canvas, 2, 3, 32, 1, 3);
    const panel = await open(canvas);
    const moved = panel.getByRole('region', { name: 'Moved by you' });
    await expect(moved.querySelectorAll('li')).toHaveLength(1);
    await expect(moved.textContent).not.toContain('more');
    await userEvent.click(
      panel.getByRole('button', { name: 'Show in brief: SaaS Sales Weekly' }),
    );
    await counts(canvas, 2, 4, 31, 1, 3);
    await userEvent.click(
      panel.getByRole('button', { name: 'Back to Needs you: Halden Health' }),
    );
    await counts(canvas, 3, 4, 30, 1, 4);
    await expect(
      panel.queryByRole('region', { name: 'Moved by you' }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      panel.getByRole('button', {
        name: 'Undo Show in brief: SaaS Sales Weekly',
      }),
    );
    await counts(canvas, 3, 3, 31, 1, 4);
    await back(canvas);
  },
};
export const Open: Story = {
  play: async (c) => {
    await open(c.canvas);
    await ready(c);
  },
};
export const Kept: Story = {
  play: async (c) => {
    const panel = await open(c.canvas);
    await userEvent.click(
      panel.getByRole('button', { name: 'Show in brief: SaaS Sales Weekly' }),
    );
    await ready(c);
  },
};
export const Added: Story = {
  play: async (c) => {
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Add to brief' }),
    );
    await ready(c);
  },
};
export const AddedAside: Story = {
  play: async (c) => {
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Add to brief' }),
    );
    await open(c.canvas);
    await ready(c);
  },
};

export const DanielOpen: Story = {
  args: { initialPersonaId: 'daniel' },
  play: Open.play,
};
export const SarahOpen: Story = {
  args: { initialPersonaId: 'sarah' },
  play: Open.play,
};
const moveHalden = async (canvas: Canvas) => {
  await userEvent.click(
    within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
      'button',
      { name: /Halden Health/ },
    ),
  );
  const read = canvas.getByRole('button', { name: /Glance’s read:/ });
  if (read.getAttribute('aria-expanded') !== 'true')
    await userEvent.click(read);
  await userEvent.click(
    canvas.getByRole('button', { name: 'Move to Set aside' }),
  );
  await waitFor(async () => {
    await expect(
      canvas.getByRole('button', { name: 'Undo Halden Health' }),
    ).toBeVisible();
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  });
};
export const MovedGroup: Story = {
  play: async (c) => {
    await moveHalden(c.canvas);
    await open(c.canvas);
    await ready(c);
  },
};
export const Returned: Story = {
  play: async (c) => {
    await moveHalden(c.canvas);
    const panel = await open(c.canvas);
    await userEvent.click(
      panel.getByRole('button', { name: 'Back to Needs you: Halden Health' }),
    );
    await ready(c);
  },
};
export const AddedKept: Story = {
  play: async (c) => {
    const demo = c.canvas.queryByRole('button', { name: /^Demo$/ });
    if (demo) await userEvent.click(demo);
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Simulate reply to Priya' }),
    );
    await waitFor(async () => {
      await expect(
        c.canvas.getByRole('button', { name: 'Undo Fernway Logistics' }),
      ).toBeVisible();
    });
    const trigger = c.canvas.queryByRole('button', { name: /^Demo$/ });
    if (trigger?.getAttribute('aria-expanded') === 'true')
      await userEvent.click(trigger);
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Add to brief' }),
    );
    const panel = await open(c.canvas);
    await userEvent.click(
      panel.getByRole('button', { name: 'Show in brief: SaaS Sales Weekly' }),
    );
    await ready(c);
  },
};
export const Okto: Story = {
  play: async (c) => {
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Add to brief' }),
    );
    await userEvent.click(
      within(c.canvas.getByRole('list', { name: 'Needs you' })).getByRole(
        'button',
        { name: /Okto Freight/ },
      ),
    );
    await ready(c);
  },
};

export const BeforeAdd: Story = { play: ready };
export const AfterAllDone: Story = {
  play: async (c) => {
    for (const name of [
      'Fernway Logistics',
      'Brightline Studio',
      'Halden Health',
    ]) {
      await userEvent.click(
        within(c.canvas.getByRole('list', { name: 'Needs you' })).getByRole(
          'button',
          { name: new RegExp(name) },
        ),
      );
      await userEvent.click(c.canvas.getByRole('button', { name: /^Done$/ }));
      await waitFor(async () => {
        await expect(
          c.canvas.getByRole('button', { name: 'Undo ' + name }),
        ).toBeVisible();
        await expect(c.canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    }
    await userEvent.click(
      c.canvas.getByRole('button', { name: 'Review set aside' }),
    );
    await expect(
      c.canvas.getByRole('region', { name: 'Set aside view' }),
    ).toBeVisible();
    await back(c.canvas);
    await waitFor(async () => {
      await expect(
        c.canvas.getByRole('button', { name: 'Review set aside' }),
      ).toHaveFocus();
    });
  },
};
