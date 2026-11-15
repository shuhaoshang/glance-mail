import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { WatchItem } from '../../../data/types';
import { Button } from '../Button/Button';
import { InlineForm } from '../InlineForm/InlineForm';
import { Text } from '../Text/Text';
import { WatchRow } from '../WatchRow/WatchRow';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './WatchlistPanel.module.css';

export interface WatchlistPanelProps {
  items: readonly WatchItem[];
  onAdd: (name: string, returnFocus: HTMLElement | null) => void;
  onRename: (id: string, name: string, returnFocus: HTMLElement | null) => void;
  onRemove: (id: string, returnFocus: HTMLElement | null) => void;
  onOpenItem?: (id: string) => void;
  isItemAvailable?: (id: string) => boolean;
  mobile?: boolean;
}
export function WatchlistPanel({
  items,
  onAdd,
  onRename,
  onRemove,
  onOpenItem,
  isItemAvailable,
  mobile,
}: WatchlistPanelProps) {
  const desktop = useDesktopLayout();
  const phone = mobile ?? !desktop;
  const heading = useId();
  const root = useRef<HTMLElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const addForm = useRef<HTMLDivElement>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const restoreAddFocus = useRef(false);
  useLayoutEffect(() => {
    if (!adding && restoreAddFocus.current) {
      restoreAddFocus.current = false;
      addButton.current?.focus({ preventScroll: true });
    }
  }, [adding]);
  function closeAdd() {
    restoreAddFocus.current = true;
    setAdding(false);
    setDraft('');
  }
  function remove(id: string) {
    const index = items.findIndex((item) => item.id === id);
    const next = items[index + 1] ?? items[index - 1];
    const nextRow = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[data-watch-id]') ?? [],
    ).find((node) => node.dataset.watchId === next?.id);
    const candidate = nextRow?.querySelector<HTMLButtonElement>(
      '[data-watch-action="rename"]',
    );
    const target =
      candidate && !candidate.closest('[hidden]')
        ? candidate
        : addButton.current;
    onRemove(id, target);
    requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  }
  return (
    <section
      ref={root}
      aria-labelledby={heading}
      className={[styles.panel, phone && styles.phone]
        .filter(Boolean)
        .join(' ')}
    >
      <header className={styles.header}>
        <div className={styles.intro}>
          <Text
            id={heading}
            as={phone ? 'h1' : 'h2'}
            variant="title"
            className={styles.title}
            tabIndex={-1}
            data-watch-heading
          >
            Watchlist
          </Text>
          <Text as="p" variant="meta" className={styles.description}>
            Things you’re waiting on. Any email about them goes to the top of
            your brief.
          </Text>
        </div>
        <Button
          ref={addButton}
          data-watch-add
          variant="outline"
          size="compact"
          leadingIcon="plus"
          onClick={() => {
            setEditingId(null);
            setAdding(true);
            requestAnimationFrame(() =>
              addForm.current?.querySelector('input')?.focus(),
            );
          }}
        >
          Add
        </Button>
      </header>
      {adding && (
        <div className={styles.add} ref={addForm}>
          <InlineForm
            label="Add a Watchlist topic"
            placeholder="What are you waiting on?"
            value={draft}
            onValueChange={setDraft}
            autoFocus
            mobile={phone}
            note="Glance looks for emails about it and puts them at the top."
            onCancel={closeAdd}
            onSubmit={(name) => {
              onAdd(name, addButton.current);
              closeAdd();
            }}
          />
        </div>
      )}
      {items.length ? (
        <ul className={styles.list} aria-label="Watchlist topics">
          {items.map((item) => (
            <WatchRow
              key={item.id}
              item={item}
              mobile={phone}
              editing={editingId === item.id}
              onEditingChange={(value) => {
                setEditingId(value ? item.id : null);
                if (value) {
                  setAdding(false);
                  setDraft('');
                }
              }}
              onRename={onRename}
              onRemove={remove}
              onOpen={
                onOpenItem &&
                item.item &&
                (!isItemAvailable || isItemAvailable(item.item))
                  ? () => onOpenItem(item.item!)
                  : undefined
              }
            />
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <Text as="p" variant="body">
            <strong>Nothing on your Watchlist.</strong>
          </Text>
          <Text as="p" variant="meta">
            Add something you’re waiting on, like a contract or a reply.
          </Text>
        </div>
      )}
    </section>
  );
}
