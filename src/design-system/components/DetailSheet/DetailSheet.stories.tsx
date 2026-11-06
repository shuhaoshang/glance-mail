import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { getPersona } from '../../../data';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import { DetailSheet } from './DetailSheet';
import styles from './DetailSheet.module.css';

const item = getPersona('maya').items[0];
function SheetExample() {
  const [open, setOpen] = useState(false);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  return (
    <div className={styles.example}>
      <Button
        onClick={(event) => {
          setReturnFocus(event.currentTarget);
          setOpen(true);
        }}
      >
        Open detail sheet
      </Button>
      <DetailSheet
        open={open}
        onClose={() => setOpen(false)}
        returnFocus={returnFocus}
        label={item.name}
      >
        <div className={styles.examplePanel}>
          <header className={styles.exampleHeader}>
            <Text as="h2" variant="title">
              {item.name}
            </Text>
            <IconButton
              icon="close"
              aria-label="Close detail"
              data-sheet-autofocus
              onClick={() => setOpen(false)}
            />
          </header>
          <div className={styles.exampleBody}>
            <Text as="p" variant="request">
              {item.request.text}
            </Text>
            <Text as="p" variant="reading">
              {item.facts[1].source.pre +
                item.facts[1].source.hl +
                item.facts[1].source.post}
            </Text>
          </div>
          <Button
            href="https://outlook.office.com/mail/"
            target="_blank"
            rel="noreferrer"
            external
          >
            Open in Outlook
          </Button>
        </div>
      </DetailSheet>
    </div>
  );
}
const meta = {
  title: 'Composites/DetailSheet',
  component: SheetExample,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => <SheetExample />,
} satisfies Meta<typeof SheetExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Closed: Story = {};
export const Open: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open detail sheet' }),
    );
    await expect(canvas.getByRole('dialog', { name: item.name })).toBeVisible();
  },
};
export const FocusAndDismissal: Story = {
  play: async ({ canvas }) => {
    const opener = canvas.getByRole('button', { name: 'Open detail sheet' });
    const openSheet = async () => {
      await userEvent.click(opener);
      const dialog = canvas.getByRole('dialog', { name: item.name });
      await expect(dialog).toHaveAttribute('aria-modal', 'true');
      await expect(
        within(dialog).getByRole('button', { name: 'Close detail' }),
      ).toHaveFocus();
      return dialog;
    };
    const closed = async () => {
      await waitFor(async () => {
        await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
        await expect(opener).toHaveFocus();
      });
    };
    let dialog = await openSheet();
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    await expect(
      within(dialog).getByRole('link', { name: 'Open in Outlook' }),
    ).toHaveFocus();
    await userEvent.tab();
    await expect(
      within(dialog).getByRole('button', { name: 'Close detail' }),
    ).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await closed();

    dialog = await openSheet();
    // Synthetic keyboard events do not trigger native dialog cancellation.
    // Real Escape dismissal is also checked in the browser review.
    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await closed();

    dialog = await openSheet();
    await userEvent.pointer([
      {
        target: dialog,
        keys: '[MouseLeft>]',
        coords: { clientX: 0, clientY: 0 },
      },
      { keys: '[/MouseLeft]' },
    ]);
    await closed();
  },
};
