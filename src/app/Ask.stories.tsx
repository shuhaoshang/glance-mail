import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DemoApp } from '../demo/DemoApp';
import { getPersona } from '../data';
const meta = {
  title: 'Patterns/Ask',
  component: DemoApp,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { initialPersonaId: 'maya' },
} satisfies Meta<typeof DemoApp>;
export default meta;
type Story = StoryObj<typeof meta>;
const prepare =
  (
    found: boolean,
    itemIndex = 0,
    question?: string,
  ): NonNullable<Story['play']> =>
  async ({ canvas, args, canvasElement }) => {
    const persona = getPersona(args.initialPersonaId ?? 'maya');
    const item = persona.items[itemIndex];
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
        'button',
        { name: new RegExp(item.name) },
      ),
    );
    await userEvent.click(canvas.getByRole('button', { name: /^Ask$/ }));
    await expect(canvas.getByRole('tab', { name: /^Ask$/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    const qa = item.qa.find((qa) =>
      question ? qa.q === question : qa.found === found,
    )!;
    await userEvent.click(canvas.getByRole('button', { name: qa.q }));
    await waitFor(async () => {
      await expect(
        canvas.getByRole('region', { name: 'Answer to ' + qa.q }),
      ).toBeVisible();
    });
    await userEvent.click(canvas.getByRole('tab', { name: 'Details' }));
    await userEvent.click(canvas.getByRole('tab', { name: /^Ask$/ }));
    await expect(
      canvas.getByRole('region', { name: 'Answer to ' + qa.q }),
    ).toHaveTextContent(qa.a);
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
    await Promise.all(
      canvasElement
        .getAnimations({ subtree: true })
        .map((a) => a.finished.catch(() => {})),
    );
    canvasElement.dataset.askReady = 'true';
  };
export const Maya: Story = { play: prepare(true) };
export const MayaNotFound: Story = { play: prepare(false) };
export const Daniel: Story = {
  args: { initialPersonaId: 'daniel' },
  play: prepare(true),
};
export const DanielNotFound: Story = {
  args: { initialPersonaId: 'daniel' },
  play: prepare(false),
};
export const Sarah: Story = {
  args: { initialPersonaId: 'sarah' },
  play: prepare(true),
};
export const SarahNotFound: Story = {
  args: { initialPersonaId: 'sarah' },
  play: prepare(false),
};
export const PhoneActions: Story = {
  args: { initialPersonaId: 'sarah' },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
        'button',
        { name: /Lincoln Elementary/ },
      ),
    );
    await expect(canvas.getByRole('button', { name: /^Ask$/ })).toBeVisible();
    canvasElement.dataset.askReady = 'true';
  },
};
export const CheckedActions: Story = {
  args: { initialPersonaId: 'sarah' },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(
      within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
        'button',
        { name: /Lincoln Elementary/ },
      ),
    );
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Sign the permission slip' }),
    );
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Pay $12' }));
    await expect(
      canvas.getByRole('button', { name: 'Mark done' }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: /^Ask$/ })).toBeVisible();
    canvasElement.dataset.askReady = 'true';
  },
};

export const Brightline: Story = {
  play: prepare(true, 1, 'Who else is on this thread?'),
};
export const SessionHistory: Story = {
  play: async ({ canvas }) => {
    const pick = async (name: string) => {
      const dialog = canvas.queryByRole('dialog');
      if (dialog) {
        await userEvent.click(
          within(dialog).getByRole('button', { name: 'Close detail' }),
        );
        await waitFor(async () => {
          await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
        });
      }
      await userEvent.click(
        within(canvas.getByRole('list', { name: 'Needs you' })).getByRole(
          'button',
          { name: new RegExp(name) },
        ),
      );
      await userEvent.click(canvas.getByRole('tab', { name: /^Ask$/ }));
    };
    const question = 'Who else is on this thread?';
    await pick('Brightline Studio');
    await userEvent.click(canvas.getByRole('button', { name: question }));
    const answer = canvas.getByRole('region', {
      name: 'Answer to ' + question,
    });
    await waitFor(async () => {
      await expect(answer).toHaveFocus();
    });
    await expect(answer.querySelector('mark')).toHaveTextContent(
      'To: you · Cc: none',
    );
    await expect(answer.closest('[aria-live], [role="log"]')).toBeNull();
    await pick('Fernway Logistics');
    await userEvent.click(
      canvas.getByRole('button', { name: 'Is the discount approved?' }),
    );
    await pick('Brightline Studio');
    await expect(
      canvas.getByRole('region', { name: 'Answer to ' + question }),
    ).toHaveTextContent('Only Ana Ruiz and you.');
    await expect(
      canvas.queryByRole('button', { name: question }),
    ).not.toBeInTheDocument();
    const dialog = canvas.queryByRole('dialog');
    if (dialog) {
      await userEvent.click(
        within(dialog).getByRole('button', { name: 'Close detail' }),
      );
      await waitFor(async () => {
        await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
      });
    }
    const change = async (name: string) => {
      const demo = canvas.queryByRole('button', { name: /^Demo$/ });
      if (demo && demo.getAttribute('aria-expanded') !== 'true')
        await userEvent.click(demo);
      await userEvent.click(canvas.getByRole('button', { name }));
    };
    await change('Daniel · Manager');
    await change('Maya · Sales');
    await pick('Brightline Studio');
    await expect(canvas.getByRole('button', { name: question })).toBeVisible();
    await expect(
      canvas.queryByRole('region', { name: 'Answer to ' + question }),
    ).not.toBeInTheDocument();
  },
};
