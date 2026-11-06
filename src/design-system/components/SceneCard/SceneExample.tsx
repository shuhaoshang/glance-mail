import { useId, useRef, useState } from 'react';
import type { Account } from '../../../data/types';
import { SourcePanel } from '../SourcePanel/SourcePanel';
import {
  SceneCard,
  type SceneCardItem,
  type SceneFieldSelection,
} from './SceneCard';
import styles from './SceneExample.module.css';

export function SceneExample({
  item,
  account,
  initialField,
  narrow = false,
  mobile = false,
  onSelectFact,
  onChecklistCompleteChange,
}: {
  item: SceneCardItem;
  account: Account;
  initialField?: { fieldKey: string; factId: string };
  narrow?: boolean;
  mobile?: boolean;
  onSelectFact?: (selection: SceneFieldSelection) => void;
  onChecklistCompleteChange?: (complete: boolean) => void;
}) {
  const [selection, setSelection] = useState<SceneFieldSelection | null>(() => {
    const fact =
      initialField &&
      item.facts.find((entry) => entry.id === initialField.factId);
    return fact
      ? { fieldKey: initialField!.fieldKey, fact, trigger: null }
      : null;
  });
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={preview}
      className={[styles.preview, narrow && styles.narrow]
        .filter(Boolean)
        .join(' ')}
    >
      <SceneCard
        item={item}
        mobile={mobile}
        selectedField={selection?.fieldKey}
        sourcePanelId={panelId}
        onChecklistCompleteChange={onChecklistCompleteChange}
        onSelectFact={(next) => {
          onSelectFact?.(next);
          trigger.current = next.trigger;
          setSelection((current) =>
            current?.fieldKey === next.fieldKey ? null : next,
          );
        }}
      />
      {selection && (
        <SourcePanel
          key={selection.fieldKey}
          id={panelId}
          from={item.from}
          when={item.when}
          animate={selection.trigger !== null}
          source={selection.fact.source}
          kind={selection.fact.kind}
          onClose={() => {
            const focusTarget =
              trigger.current ??
              preview.current?.querySelector<HTMLButtonElement>(
                'button[aria-expanded="true"]',
              );
            setSelection(null);
            focusTarget?.focus();
          }}
          onOpenEmail={() =>
            window.open(
              {
                Gmail: 'https://mail.google.com/',
                Outlook: 'https://outlook.office.com/mail/',
                'Yahoo Mail': 'https://mail.yahoo.com/',
              }[account.app],
              '_blank',
              'noopener,noreferrer',
            )
          }
        />
      )}
    </div>
  );
}
