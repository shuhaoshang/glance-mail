import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../../../data';
import { AskThread } from './AskThread';
import styles from './AskThread.module.css';
const meta = {
  title: 'Composites/AskThread',
  component: AskThread,
  args: { item: getPersona('maya').items[0] },
  decorators: [
    (Story) => (
      <div className={styles.preview}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AskThread>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Found: Story = { args: { initialAsked: [1] } };
export const NotFound: Story = { args: { initialAsked: [0] } };
export const AllQuestions: Story = {
  render: () => (
    <>
      {['maya', 'daniel', 'sarah'].flatMap((id) =>
        getPersona(id as 'maya' | 'daniel' | 'sarah').items.map((item) => (
          <AskThread key={id + item.id} item={item} />
        )),
      )}
    </>
  ),
  play: async ({ canvas }) => {
    const items = ['maya', 'daniel', 'sarah'].flatMap(
      (id) => getPersona(id as 'maya' | 'daniel' | 'sarah').items,
    );
    const threads = canvas.getAllByRole('region', { name: 'Ask Glance' });
    for (const [index, item] of items.entries()) {
      const thread = within(threads[index]);
      for (const qa of item.qa) {
        await userEvent.click(thread.getByRole('button', { name: qa.q }));
        const answer = thread.getByRole('region', {
          name: 'Answer to ' + qa.q,
        });
        await waitFor(async () => {
          await expect(answer).toBeVisible();
        });
        await expect(answer).toHaveTextContent(qa.a);
        if (!qa.found) {
          await expect(
            within(answer).getByRole('heading', { name: 'Not in your email' }),
          ).toBeVisible();
          await expect(answer.querySelector('svg,mark')).toBeNull();
        } else {
          await expect(
            within(answer).getByText('Glance', { exact: true }),
          ).toBeVisible();
          if (qa.source)
            await expect(answer.querySelector('mark')).toHaveTextContent(
              qa.source.hl,
            );
        }
        await expect(
          thread.queryByRole('button', { name: qa.q }),
        ).not.toBeInTheDocument();
      }
      await expect(
        thread.getByText(/that’s every prepared question/),
      ).toBeVisible();
    }
    await expect(canvas.queryByRole('textbox')).not.toBeInTheDocument();
  },
};
