import { keepDatesTogether } from '../keepDatesTogether';
import { useLayoutEffect, useRef, useState } from 'react';
import type { WatchItem } from '../../../data/types';
import { Icon } from '../Icon/Icon';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import { InlineForm } from '../InlineForm/InlineForm';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './WatchRow.module.css';

export interface WatchRowProps {
  item: WatchItem;
  onOpen?: () => void;
  onRename: (id: string, name: string, returnFocus: HTMLElement | null) => void;
  onRemove: (id: string) => void;
  editing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  mobile?: boolean;
}
export function WatchRow({
  item,
  onOpen,
  onRename,
  onRemove,
  editing: controlledEditing,
  onEditingChange,
  mobile,
}: WatchRowProps) {
  const desktop = useDesktopLayout();
  const phone = mobile ?? !desktop;
  const [localEditing, setLocalEditing] = useState(false);
  const [draft, setDraft] = useState(item.name);
  const rename = useRef<HTMLButtonElement>(null);
  const editing = controlledEditing ?? localEditing;
  const restoreFocus = useRef(false);
  useLayoutEffect(() => {
    if (!editing && restoreFocus.current) {
      restoreFocus.current = false;
      rename.current?.focus({ preventScroll: true });
    }
  }, [editing]);
  function setEditing(value: boolean) {
    setLocalEditing(value);
    onEditingChange?.(value);
  }
  function finishEditing() {
    restoreFocus.current = true;
    setEditing(false);
  }
  return (
    <li className={styles.item} data-watch-id={item.id}>
      <div
        className={[styles.row, phone && styles.phone]
          .filter(Boolean)
          .join(' ')}
        hidden={editing}
      >
        <span className={styles.icon}>
          <Icon name="eye" />
        </span>
        <span className={styles.name}>{keepDatesTogether(item.name)}</span>
        <div className={styles.meta}>
          <span className={styles.status}>
            {keepDatesTogether(item.status)}
          </span>
          {item.news > 0 && onOpen ? (
            <Button
              data-watch-news
              variant="tint"
              size="compact"
              className={styles.news}
              trailingIcon="chevron"
              onClick={onOpen}
              aria-label={item.news + ' new for ' + item.name}
            >
              {item.news + ' new'}
            </Button>
          ) : (
            <span className={styles.status}>
              {item.news > 0 ? item.news + ' new' : 'Nothing new'}
            </span>
          )}
        </div>
        <div className={styles.actions}>
          <IconButton
            ref={rename}
            data-watch-action="rename"
            icon="pencil"
            size="compact"
            aria-label={'Rename ' + item.name}
            onClick={() => {
              setDraft(item.name);
              setEditing(true);
            }}
          />
          <IconButton
            data-watch-action="remove"
            icon="trash"
            size="compact"
            aria-label={'Remove ' + item.name}
            onClick={() => onRemove(item.id)}
          />
        </div>
      </div>
      {editing && (
        <div className={styles.editor}>
          <InlineForm
            label={'Rename ' + item.name}
            value={draft}
            onValueChange={setDraft}
            submitLabel="Save"
            autoFocus
            mobile={phone}
            onCancel={finishEditing}
            onSubmit={(name) => {
              onRename(item.id, name, rename.current);
              finishEditing();
            }}
          />
        </div>
      )}
    </li>
  );
}
