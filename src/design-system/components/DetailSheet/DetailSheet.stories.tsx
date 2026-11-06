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

function sheetOffset(dialog: HTMLElement) {
  const transform = getComputedStyle(dialog).transform;
  return transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m42;
}

async function waitForSheetMotion(dialog: HTMLElement) {
  await Promise.all(
    dialog
      .getAnimations()
      .map((animation) => animation.finished.catch(() => {})),
  );
}

function dragPointer(handle: HTMLElement) {
  // Synthetic events have no active native pointer to capture. Native capture is
  // checked separately with a real pointer in the browser review.
  const capture = handle.setPointerCapture;
  handle.setPointerCapture = () => {};
  // React replaces a zero event timestamp with Date.now(), so use one nonzero
  // performance-clock origin for pointer events and animation frames.
  const timeOrigin = performance.now();
  const frames = new Map<number, FrameRequestCallback>();
  let frameId = 0;
  const withFrameClock = (callback: () => void) => {
    const request = window.requestAnimationFrame;
    const cancel = window.cancelAnimationFrame;
    // Drive frame samples with the same deterministic clock as pointer events.
    window.requestAnimationFrame = (frame) => {
      const id = ++frameId;
      frames.set(id, frame);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      frames.delete(id);
    };
    try {
      callback();
    } finally {
      window.requestAnimationFrame = request;
      window.cancelAnimationFrame = cancel;
    }
  };
  const dispatch = (type: string, y: number, time: number) => {
    const event = new PointerEvent(type, {
      bubbles: true,
      pointerId: 1,
      pointerType: 'touch',
      isPrimary: true,
      button: 0,
      buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
      clientX: handle.getBoundingClientRect().left,
      clientY: y,
    });
    Object.defineProperty(event, 'timeStamp', { value: timeOrigin + time });
    withFrameClock(() => handle.dispatchEvent(event));
  };
  return {
    down: (y: number, time: number) => dispatch('pointerdown', y, time),
    move: (y: number, time: number) => dispatch('pointermove', y, time),
    up: (y: number, time: number) => dispatch('pointerup', y, time),
    cancel: (y: number, time: number) => dispatch('pointercancel', y, time),
    frame: (time: number) => {
      const pending = Array.from(frames.values());
      frames.clear();
      withFrameClock(() =>
        pending.forEach((frame) => frame(timeOrigin + time)),
      );
    },
    restore: () => {
      frames.clear();
      handle.setPointerCapture = capture;
    },
  };
}

export const DragPreview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The sheet follows the handle and stays below the dismissal distance in this held-drag preview. Reduced motion still preserves this direct manipulation.',
      },
    },
  },
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open detail sheet' }),
    );
    const dialog = canvas.getByRole('dialog', { name: item.name });
    await waitForSheetMotion(dialog);
    const pointer = dragPointer(within(dialog).getByRole('separator'));
    try {
      const distance = dialog.getBoundingClientRect().height * 0.15;
      pointer.down(100, 0);
      pointer.move(100 + distance, 1000);
      await expect(sheetOffset(dialog)).toBeCloseTo(distance, 1);
      await expect(dialog).toHaveAttribute('data-drag-state', 'dragging');
    } finally {
      pointer.restore();
    }
  },
};

export const DragDismissalThresholds: Story = {
  play: async ({ canvas, step }) => {
    const opener = canvas.getByRole('button', { name: 'Open detail sheet' });
    const openSheet = async () => {
      await userEvent.click(opener);
      const dialog = canvas.getByRole('dialog', { name: item.name });
      await waitForSheetMotion(dialog);
      return dialog;
    };
    const closed = async () => {
      await waitFor(async () => {
        await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
        await expect(opener).toHaveFocus();
      });
    };
    await step(
      'Exactly 25% of the sheet height closes, even at low speed',
      async () => {
        const dialog = await openSheet();
        const pointer = dragPointer(within(dialog).getByRole('separator'));
        try {
          const distance = dialog.getBoundingClientRect().height * 0.25;
          pointer.down(100, 0);
          pointer.move(100 + distance, 1000);
          await expect(sheetOffset(dialog)).toBeCloseTo(distance, 1);
          pointer.up(100 + distance, 2000);
          await closed();
        } finally {
          pointer.restore();
        }
      },
    );
    await step(
      'A short flick faster than 0.5 px/ms closes when release repeats the final coordinates',
      async () => {
        const dialog = await openSheet();
        const pointer = dragPointer(within(dialog).getByRole('separator'));
        try {
          pointer.down(100, 0);
          pointer.move(120, 20);
          pointer.up(120, 30);
          await closed();
        } finally {
          pointer.restore();
        }
      },
    );
  },
};

export const DragReturnAndCancellation: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Short or canceled drags return with the fast motion token. Enable reduced motion to verify that dragging still follows the pointer and returning is immediate.',
      },
    },
  },
  play: async ({ canvas, step }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Open detail sheet' }),
    );
    const dialog = canvas.getByRole('dialog', { name: item.name });
    await waitForSheetMotion(dialog);
    const pointer = dragPointer(within(dialog).getByRole('separator'));
    const returned = async () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        await expect(sheetOffset(dialog)).toBe(0);
        await expect(getComputedStyle(dialog).transitionDuration).toBe('0s');
      }
      await waitFor(async () => {
        await expect(sheetOffset(dialog)).toBeCloseTo(0, 1);
        await expect(dialog).toHaveAttribute('open');
        await expect(dialog).toHaveAttribute('data-drag-state', 'returning');
      });
      await expect(dialog.ownerDocument.body.style.overflow).toBe('hidden');
    };
    try {
      await step(
        'A slow drag below the distance threshold returns',
        async () => {
          const distance = dialog.getBoundingClientRect().height * 0.24;
          pointer.down(100, 0);
          pointer.move(100 + distance, 1000);
          await expect(sheetOffset(dialog)).toBeCloseTo(distance, 1);
          pointer.up(100 + distance, 2000);
          await returned();
        },
      );
      await step(
        'Exactly 0.5 px/ms returns because the velocity threshold is strictly greater',
        async () => {
          pointer.down(100, 3000);
          pointer.move(120, 3020);
          pointer.up(120, 3040);
          await returned();
        },
      );
      await step(
        'A flick followed by a pause does not retain stale velocity',
        async () => {
          pointer.down(100, 4000);
          pointer.move(120, 4020);
          pointer.up(120, 4400);
          await returned();
        },
      );
      await step(
        'A stationary pointer sample clears the preceding flick velocity',
        async () => {
          pointer.down(100, 4500);
          pointer.move(120, 4510);
          pointer.move(120, 4530);
          pointer.up(120, 4531);
          await returned();
        },
      );
      await step(
        'A held finger clears flick velocity even without another pointermove event',
        async () => {
          pointer.down(100, 4600);
          pointer.move(120, 4610);
          pointer.frame(4616);
          pointer.frame(4632);
          pointer.up(120, 4701);
          await returned();
        },
      );
      await step('Upward motion stays at the resting position', async () => {
        pointer.down(100, 5000);
        pointer.move(80, 5020);
        await expect(sheetOffset(dialog)).toBe(0);
        pointer.up(80, 5040);
        await returned();
      });
      await step(
        'A canceled drag returns even beyond the dismissal distance',
        async () => {
          const distance = dialog.getBoundingClientRect().height * 0.3;
          pointer.down(100, 6000);
          pointer.move(100 + distance, 6100);
          await expect(sheetOffset(dialog)).toBeCloseTo(distance, 1);
          pointer.cancel(100 + distance, 6120);
          await returned();
        },
      );
    } finally {
      pointer.restore();
    }
  },
};
