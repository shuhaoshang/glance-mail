import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../data';
import { DemoApp } from '../demo/DemoApp';
const meta = {
  title: 'Patterns/Item lifecycle',
  component: DemoApp,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { initialPersonaId: 'maya' },
} satisfies Meta<typeof DemoApp>;
export default meta;
type Story = StoryObj<typeof meta>;
type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];
async function select(canvas: Canvas, name: string) {
  await userEvent.click(
    within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
      'button',
      { name: new RegExp(name) },
    ),
  );
}
async function simulate(canvas: Canvas, name: string) {
  const demo = canvas.queryByRole('button', { name: /^Demo$/ });
  if (demo && demo.getAttribute('aria-expanded') !== 'true')
    await userEvent.click(demo);
  await userEvent.click(canvas.getByRole('button', { name }));
}
async function progress(
  canvas: Canvas,
  needs: number,
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
      canvas.getByRole('status', { name: 'Brief progress' }),
    ).toHaveTextContent(done + ' of ' + total + ' done');
  });
}
async function settled(canvas: Canvas, name: string) {
  await waitFor(async () => {
    await expect(
      canvas.getByRole('button', { name: 'Undo ' + name }),
    ).toBeVisible();
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  });
}
async function done(canvas: Canvas, name: string) {
  await select(canvas, name);
  await userEvent.click(canvas.getByRole('button', { name: /^Done$/ }));
  await settled(canvas, name);
}
export const Maya: Story = {};
export const Daniel: Story = { args: { initialPersonaId: 'daniel' } };
export const Sarah: Story = { args: { initialPersonaId: 'sarah' } };
export const MayaFlow: Story = {
  play: async ({ canvas }) => {
    await simulate(canvas, 'Simulate reply to Priya');
    await settled(canvas, 'Fernway Logistics');
    await progress(canvas, 2, 2, 4);
    await expect(
      canvas.getByText(/reply detected in Outlook, 9:14 AM/),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Fernway Logistics' }),
    );
    await progress(canvas, 3, 1, 4);
    await expect(
      within(canvas.getByRole('list', { name: 'Needs you' }))
        .getAllByRole('button')
        .filter((el) => el.hasAttribute('data-brief-item'))
        .map((el) => el.dataset.briefItem),
    ).toEqual(['fernway', 'brightline', 'halden']);
  },
};
export const DanielFlow: Story = {
  args: { initialPersonaId: 'daniel' },
  play: async ({ canvas }) => {
    await simulate(canvas, 'Simulate reply to Sam');
    await settled(canvas, 'Checkout redesign');
    await progress(canvas, 3, 2, 5);
    await select(canvas, 'Expense report: Jordan Kim');
    await expect(
      canvas.getByRole('button', { name: /Total:.*1,840/ }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^Approve$/ }),
    ).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /^Done$/ }));
    await settled(canvas, 'Expense report: Jordan Kim');
    await progress(canvas, 2, 3, 5);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Expense report: Jordan Kim' }),
    );
    await progress(canvas, 3, 2, 5);
  },
};
export const SarahFlow: Story = {
  args: { initialPersonaId: 'sarah' },
  play: async ({ canvas }) => {
    await select(canvas, 'Lincoln Elementary');
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Sign the permission slip' }),
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Pay $12' }));
    await expect(
      canvas.getByRole('button', { name: 'Mark done' }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole('button', { name: /^Snooze$/ }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Open in Yahoo Mail' }).className,
    ).toContain('outline');
    await expect(
      canvas.getByRole('button', { name: 'Mark done' }).className,
    ).toContain('primary');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Pay $12' }));
    await expect(
      canvas.getByRole('button', { name: /^Snooze$/ }),
    ).toBeVisible();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Pay $12' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Mark done' }));
    await settled(canvas, 'Lincoln Elementary');
    await progress(canvas, 3, 1, 4);
    for (const name of [
      'Fernway Logistics',
      'Brightline Studio',
      'Halden Health',
    ])
      await done(canvas, name);
    await progress(canvas, 0, 4, 4);
    await expect(
      canvas.getByRole('heading', { name: 'Nothing else needs you today' }),
    ).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Brightline Studio' }),
    );
    await progress(canvas, 1, 3, 4);
    await expect(
      canvas.queryByRole('region', { name: 'All done' }),
    ).not.toBeInTheDocument();
  },
};
export const Done: Story = {
  play: async ({ canvas }) => {
    await done(canvas, 'Fernway Logistics');
  },
};
export const Snooze: Story = {
  play: async ({ canvas }) => {
    await select(canvas, 'Fernway Logistics');
    await userEvent.click(canvas.getByRole('button', { name: /^Snooze$/ }));
  },
};
export const Undo: Story = {
  play: async ({ canvas }) => {
    await done(canvas, 'Halden Health');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Halden Health' }),
    );
  },
};
export const ChecklistComplete: Story = {
  args: { initialPersonaId: 'sarah' },
  play: async ({ canvas }) => {
    await select(canvas, 'Lincoln Elementary');
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Sign the permission slip' }),
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Pay $12' }));
  },
};
export const AllDone: Story = {
  play: async ({ canvas }) => {
    for (const name of getPersona('maya')
      .items.filter((item) => !item.isNew)
      .map((item) => item.name))
      await done(canvas, name);
  },
};
export const SimulatedReply: Story = {
  play: async ({ canvas }) => {
    await simulate(canvas, 'Simulate reply to Priya');
    await settled(canvas, 'Fernway Logistics');
  },
};

export const AllSnoozed: Story = {
  play: async ({ canvas }) => {
    for (const name of [
      'Fernway Logistics',
      'Brightline Studio',
      'Halden Health',
    ]) {
      await select(canvas, name);
      await userEvent.click(canvas.getByRole('button', { name: /^Snooze$/ }));
      await userEvent.click(
        canvas.getByRole('button', { name: 'Later today, 3:00 PM' }),
      );
      await settled(canvas, name);
    }
    await progress(canvas, 0, 1, 4);
    await expect(
      canvas.getByRole('heading', { name: 'Nothing else needs you right now' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('region', { name: 'All done' }),
    ).toHaveTextContent('3 snoozed items will come back later.');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Undo Brightline Studio' }),
    );
    await progress(canvas, 1, 1, 4);
  },
};
export const Reasoning: Story = {
  play: async ({ canvas }) => {
    await select(canvas, 'Halden Health');
    await userEvent.click(canvas.getByRole('button', { name: /^Why it’s/ }));
  },
};

export const SimulateReady: Story = {
  play: async ({ canvas }) => {
    const trigger = canvas.queryByRole('button', { name: /^Demo$/ });
    if (trigger) await userEvent.click(trigger);
  },
};
export const ReducedMotion: Story = {
  play: async ({ canvas }) => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    await select(canvas, 'Fernway Logistics');
    await userEvent.click(canvas.getByRole('button', { name: /^Done$/ }));
    await expect(
      canvas
        .getByRole('list', { name: 'Needs you' })
        .querySelector('[data-brief-item="fernway"]'),
    ).not.toBeInTheDocument();
    await progress(canvas, 2, 2, 4);
  },
};

export const SimulateInTextLevel: Story = {
  args: { initialLevel: 2 },
  play: async ({ canvas }) => {
    await simulate(canvas, 'Simulate reply to Priya');
    await expect(
      canvas.getByRole('button', { name: 'Reply to Priya detected ✓' }),
    ).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: '3 Glance' }));
    await progress(canvas, 2, 2, 4);
    await expect(
      canvas.getByRole('button', { name: 'Undo Fernway Logistics' }),
    ).toBeVisible();
  },
};

export const SnoozedEmpty: Story = {
  play: async ({ canvas }) => {
    for (const name of [
      'Fernway Logistics',
      'Brightline Studio',
      'Halden Health',
    ]) {
      await select(canvas, name);
      await userEvent.click(canvas.getByRole('button', { name: /^Snooze$/ }));
      await userEvent.click(
        canvas.getByRole('button', { name: 'Later today, 3:00 PM' }),
      );
      await settled(canvas, name);
    }
    await progress(canvas, 0, 1, 4);
    await expect(
      canvas.getByRole('heading', { name: 'Nothing else needs you right now' }),
    ).toBeVisible();
  },
};

export const SnoozedResult: Story = {
  play: async ({ canvas }) => {
    await select(canvas, 'Fernway Logistics');
    await userEvent.click(canvas.getByRole('button', { name: /^Snooze$/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Tomorrow, 8:00 AM' }),
    );
    await settled(canvas, 'Fernway Logistics');
  },
};
export const SimulatedResult: Story = {
  play: async ({ canvas }) => {
    await simulate(canvas, 'Simulate reply to Priya');
    await settled(canvas, 'Fernway Logistics');
    const trigger = canvas.queryByRole('button', { name: /^Demo$/ });
    if (trigger && trigger.getAttribute('aria-expanded') === 'true')
      await userEvent.click(trigger);
  },
};

// A capture is ready after its prepared state and entrance animations finish.
for (const story of [
  Done,
  Snooze,
  Undo,
  ChecklistComplete,
  AllDone,
  SimulatedReply,
  Reasoning,
  SarahFlow,
  SimulateReady,
  SnoozedEmpty,
  SnoozedResult,
  SimulatedResult,
]) {
  const prepare = story.play;
  story.play = async (context) => {
    await prepare?.(context);
    await Promise.all(
      context.canvasElement
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished.catch(() => {})),
    );
    context.canvasElement.dataset.reviewReady = 'true';
  };
}
