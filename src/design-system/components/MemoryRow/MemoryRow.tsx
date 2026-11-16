import { keepDatesTogether } from '../keepDatesTogether';
import { useState } from 'react';
import type { MemoryNote } from '../../../data/types';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { InlineForm } from '../InlineForm/InlineForm';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './MemoryRow.module.css';

export interface MemoryRowProps {
  note: MemoryNote;
  kind: 'instructions' | 'learned';
  editing?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (text: string) => void;
  onRemove: () => void;
}

export function MemoryRow({
  note,
  kind,
  editing,
  onEdit,
  onCancel,
  onSave,
  onRemove,
}: MemoryRowProps) {
  const desktop = useDesktopLayout();
  const [draft, setDraft] = useState(note.text);
  return (
    <li data-memory-note={note.id} className={styles.row}>
      {editing ? (
        <InlineForm
          label="Edit memory note"
          value={draft}
          onValueChange={setDraft}
          submitLabel="Save"
          autoFocus
          onCancel={onCancel}
          onSubmit={onSave}
        />
      ) : (
        <div
          className={[styles.content, !desktop && styles.phone]
            .filter(Boolean)
            .join(' ')}
        >
          <span className={styles.mark} aria-hidden="true">
            {kind === 'instructions' ? '“' : <Icon name="bulb" />}
          </span>
          <div className={styles.copy}>
            <p className={styles.text}>{keepDatesTogether(note.text)}</p>
            <p className={styles.meta}>{keepDatesTogether(note.meta)}</p>
          </div>
          <div className={styles.actions}>
            <IconButton
              data-memory-edit
              icon="pencil"
              aria-label={'Edit ' + note.text}
              onClick={() => {
                setDraft(note.text);
                onEdit();
              }}
            />
            <IconButton
              icon="trash"
              aria-label={'Remove ' + note.text}
              onClick={onRemove}
            />
          </div>
        </div>
      )}
    </li>
  );
}
