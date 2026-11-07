import { useId, useRef } from 'react';
import type { Account, KnowItem } from '../../../data/types';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { Icon } from '../Icon/Icon';
import { Field } from '../Field/Field';
import { ReasonPill } from '../ReasonPill/ReasonPill';
import { SourcePanel } from '../SourcePanel/SourcePanel';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import { Text } from '../Text/Text';
import { useSectionDisclosure } from '../SectionCard/disclosure';
import motion from '../ListMotion.module.css';
import styles from './KnowRow.module.css';

type OpenEmail = (source: KnowItem['fact']['source']) => void;
type KnowRowProps =
  | { item: KnowItem; account?: Account; onOpenEmail: OpenEmail }
  | {
      item: { title: string; sub: string; movedByUser: true };
      account?: never;
      onOpenEmail?: never;
    };
export function KnowRow({ item, account, onOpenEmail }: KnowRowProps) {
  const prefix = useId();
  const { active, toggle, close } = useSectionDisclosure();
  const fieldRef = useRef<HTMLButtonElement>(null),
    reasonRef = useRef<HTMLButtonElement>(null);
  const factKey = prefix + '-fact',
    reasonKey = prefix + '-reason',
    panelId = prefix + '-source';
  if ('movedByUser' in item)
    return (
      <div role="listitem" className={[styles.row, motion.enter].join(' ')}>
        <div className={styles.main}>
          <span className={[styles.tile, styles.neutral].join(' ')}>
            <Icon name="mail" />
          </span>
          <div className={styles.text}>
            <strong>{item.title}</strong>
            {': ' + item.sub}
          </div>
          <span className={styles.moved}>Moved by you</span>
        </div>
      </div>
    );
  const i = item.text.indexOf(item.fact.value);
  if (
    i < 0 ||
    item.text.indexOf(item.fact.value, i + item.fact.value.length) !== -1
  )
    throw new Error('KnowRow requires one fact value in its text.');
  const factOpen = active === factKey,
    reasonOpen = active === reasonKey;
  return (
    <div
      role="listitem"
      className={styles.row}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || (!factOpen && !reasonOpen)) return;
        event.preventDefault();
        event.stopPropagation();
        close();
        (factOpen ? fieldRef : reasonRef).current?.focus();
      }}
    >
      <div className={styles.main}>
        <span className={[styles.tile, styles[item.tone]].join(' ')}>
          <Icon name={item.icon} />
        </span>
        <div className={styles.text}>
          <strong>{item.title}</strong>
          {item.text.slice(0, i)}
          <Field
            ref={fieldRef}
            value={item.fact.value}
            fact={factKey}
            kind={item.fact.kind}
            inline
            selected={factOpen}
            sourcePanelId={panelId}
            onSelect={() => toggle(factKey)}
          />
          {item.text.slice(i + item.fact.value.length)}
          {account && (
            <>
              {' '}
              <AccountLabel account={account} />
            </>
          )}
          {item.judgment && (
            <>
              {' '}
              <ReasonPill
                ref={reasonRef}
                size="small"
                label={item.judgment.label}
                expanded={reasonOpen}
                controls={prefix + '-judgment'}
                onToggle={() => toggle(reasonKey)}
              />
            </>
          )}
        </div>
      </div>
      {factOpen && (
        <div className={styles.disclosure}>
          <SourcePanel
            id={panelId}
            {...item.fact.source}
            source={item.fact.source}
            kind={item.fact.kind}
            onOpenEmail={() => onOpenEmail!(item.fact.source)}
            onClose={() => {
              close();
              fieldRef.current?.focus();
            }}
          />
        </div>
      )}
      {reasonOpen && item.judgment && (
        <div
          id={prefix + '-judgment'}
          role="region"
          aria-label={item.judgment.label}
          className={styles.disclosure}
        >
          <Text as="p" variant="reading" className={styles.read}>
            <GlanceMark /> {item.judgment.read}
          </Text>
          <SourcePanel
            {...item.judgment.source}
            source={item.judgment.source}
            kind="judgment"
            onOpenEmail={() => onOpenEmail!(item.judgment!.source)}
            onClose={() => {
              close();
              reasonRef.current?.focus();
            }}
          />
        </div>
      )}
    </div>
  );
}
