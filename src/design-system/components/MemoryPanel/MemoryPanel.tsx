import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { MemoryNote } from '../../../data/types';
import { Button } from '../Button/Button';
import { InlineForm } from '../InlineForm/InlineForm';
import { MemoryRow } from '../MemoryRow/MemoryRow';
import { Text } from '../Text/Text';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './MemoryPanel.module.css';

export interface MemoryPanelProps {
  memory: Readonly<Record<'instructions' | 'learned', readonly MemoryNote[]>>;
  onAdd: (text: string) => void;
  onEdit: (kind: 'instructions' | 'learned', id: string, text: string) => void;
  onRemove: (kind: 'instructions' | 'learned', id: string) => void;
}

const sections = [
  {
    kind: 'instructions',
    title: 'Your instructions',
    hint: 'Rules in your own words. They always win.',
  },
  {
    kind: 'learned',
    title: 'Learned',
    hint: 'Patterns from what you read and move. Edit one and it becomes your instruction.',
  },
] as const;

export function MemoryPanel({
  memory,
  onAdd,
  onEdit,
  onRemove,
}: MemoryPanelProps) {
  const desktop = useDesktopLayout();
  const heading = useId();
  const root = useRef<HTMLElement>(null);
  const [editor, setEditor] = useState<
    { kind: 'add' } | { kind: 'edit'; id: string } | null
  >(null);
  const [draft, setDraft] = useState('');
  const focusAfterChange = useRef<string | 'add' | null>(null);

  useLayoutEffect(() => {
    const id = focusAfterChange.current;
    if (!id) return;
    focusAfterChange.current = null;
    const row = Array.from(
      root.current?.querySelectorAll<HTMLElement>('[data-memory-note]') ?? [],
    ).find((node) => node.dataset.memoryNote === id);
    (
      row?.querySelector<HTMLElement>('[data-memory-edit]') ??
      root.current?.querySelector<HTMLElement>('[data-memory-add]')
    )?.focus();
  }, [editor, memory]);

  function closeEditor(focus: string) {
    focusAfterChange.current = focus;
    setEditor(null);
  }

  return (
    <section
      ref={root}
      aria-labelledby={heading}
      className={[styles.panel, !desktop && styles.phone]
        .filter(Boolean)
        .join(' ')}
    >
      <header>
        <Text
          id={heading}
          as={desktop ? 'h2' : 'h1'}
          variant="title"
          className={styles.title}
          tabIndex={-1}
          data-memory-heading
        >
          Memory
        </Text>
        <Text as="p" variant="meta" className={styles.description}>
          Glance sorts your email with what you tell it and what it learns.
          Change anything here.
        </Text>
      </header>
      {sections.map(({ kind, title, hint }) => (
        <section
          className={styles.section}
          key={kind}
          aria-labelledby={heading + '-' + kind}
        >
          <div className={styles.sectionHeader}>
            <div>
              <Text
                id={heading + '-' + kind}
                as={desktop ? 'h3' : 'h2'}
                variant="body"
                className={styles.sectionTitle}
              >
                {title}{' '}
                <span className={styles.count}>{memory[kind].length}</span>
              </Text>
              <Text as="p" variant="meta" className={styles.hint}>
                {hint}
              </Text>
            </div>
            {kind === 'instructions' && (
              <Button
                data-memory-add
                variant="outline"
                size="compact"
                leadingIcon="plus"
                onClick={() => {
                  if (editor?.kind === 'add') {
                    root.current
                      ?.querySelector<HTMLInputElement>(
                        '[data-memory-add-form] input',
                      )
                      ?.focus();
                    return;
                  }
                  setDraft('');
                  setEditor({ kind: 'add' });
                }}
              >
                Add
              </Button>
            )}
          </div>
          {kind === 'instructions' && editor?.kind === 'add' && (
            <div className={styles.add} data-memory-add-form>
              <InlineForm
                label="Add an instruction"
                placeholder="Tell Glance a rule, in your own words"
                note="Glance follows it from the next email."
                value={draft}
                onValueChange={setDraft}
                autoFocus
                onCancel={() => closeEditor('add')}
                onSubmit={(text) => {
                  onAdd(text);
                  closeEditor('add');
                }}
              />
            </div>
          )}
          <ul className={styles.list} aria-label={title}>
            {memory[kind].map((note, index) => (
              <MemoryRow
                key={note.id}
                note={note}
                kind={kind}
                editing={editor?.kind === 'edit' && editor.id === note.id}
                onEdit={() => setEditor({ kind: 'edit', id: note.id })}
                onCancel={() => closeEditor(note.id)}
                onSave={(text) => {
                  onEdit(kind, note.id, text);
                  closeEditor(note.id);
                }}
                onRemove={() => {
                  const next =
                    memory[kind][index + 1] ?? memory[kind][index - 1];
                  closeEditor(next?.id ?? 'add');
                  onRemove(kind, note.id);
                }}
              />
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
}
