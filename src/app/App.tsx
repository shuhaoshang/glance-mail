import { useEffect, useRef, useState, type ReactNode } from 'react';
import { getPersona, type PersonaId } from '../data';
import type { Account } from '../data/types';
import { Text } from '../design-system/components/Text/Text';
import { Icon } from '../design-system/components/Icon/Icon';
import { Avatar } from '../design-system/components/Avatar/Avatar';
import { DetailSheet } from '../design-system/components/DetailSheet/DetailSheet';
import { DetailPanel } from '../design-system/components/DetailPanel/DetailPanel';
import { CollapsedGroup } from '../design-system/components/CollapsedGroup/CollapsedGroup';
import { SectionCard } from '../design-system/components/SectionCard/SectionCard';
import { BriefRow } from '../design-system/components/BriefRow/BriefRow';
import { KnowRow } from '../design-system/components/KnowRow/KnowRow';
import { DoneRow } from '../design-system/components/DoneRow/DoneRow';
import { ProgressBar } from '../design-system/components/ProgressBar/ProgressBar';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import {
  useItemLifecycle,
  type ItemLifecycle,
  type Resolution,
} from './useItemLifecycle';
import { AllDone } from '../design-system/components/AllDone/AllDone';
import styles from './App.module.css';

function openInbox(account: Account) {
  const urls = {
    Gmail: 'https://mail.google.com/',
    Outlook: 'https://outlook.office.com/mail/',
    'Yahoo Mail': 'https://mail.yahoo.com/',
  };
  window.open(urls[account.app], '_blank', 'noopener,noreferrer');
}

function Brief({
  personaId,
  children,
  startClean = false,
  session,
}: {
  personaId: PersonaId;
  children?: ReactNode;
  startClean?: boolean;
  session?: ItemLifecycle;
}) {
  const persona = getPersona(personaId);
  const local = useItemLifecycle(persona);
  const life = session ?? local;
  const items = life.active;
  const [selectedId, setSelectedId] = useState(
    items[persona.demo.initialSelection.itemIndex]?.id ?? items[0]?.id,
  );
  const desktop = useDesktopLayout();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [previousDesktop, setPreviousDesktop] = useState(desktop);
  if (previousDesktop !== desktop) {
    setPreviousDesktop(desktop);
    if (desktop) setSheetOpen(false);
  }
  const selected = items.find((item) => item.id === selectedId) ?? items[0];
  const counts = life.counts;
  const [sheetItem, setSheetItem] = useState(items[0]);
  const [sheetPosition, setSheetPosition] = useState(1);
  const [sheetTotal, setSheetTotal] = useState(items.length);
  const [focusResult, setFocusResult] = useState<string | null>(null);
  const undoRefs = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    const id = focusResult;
    if (!id || !life.records[id]) return;
    let frame: number;
    const restore = () => {
      if (document.querySelector('dialog[open]')) {
        frame = requestAnimationFrame(restore);
        return;
      }
      undoRefs.current.get(id)?.focus({ preventScroll: true });
      setFocusResult(null);
    };
    frame = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(frame);
  }, [life.records, focusResult]);
  function act(id: string, result: Resolution) {
    setFocusResult(id);
    life.finish(id, result);
    setSheetOpen(false);
  }
  function undo(id: string) {
    life.undo(id);
    requestAnimationFrame(() =>
      Array.from(
        document.querySelectorAll<HTMLButtonElement>('[data-brief-item]'),
      )
        .find((button) => button.dataset.briefItem === id)
        ?.focus({ preventScroll: true }),
    );
  }
  const movedCount = Object.values(life.records).filter(
    (entry) => entry.kind === 'moved',
  ).length;
  const detailActions = (id: string) => ({
    busy: !!life.pending,
    checkedSteps: life.checks[id] ?? [],
    onChecksChange: (values: boolean[]) => life.check(id, values),
    onDone: () => act(id, { kind: 'done', note: 'marked done in Glance' }),
    onMoveAside: () =>
      act(id, { kind: 'moved', note: 'moved to Set aside by you' }),
    onSnooze: (label: string) =>
      act(id, {
        kind: 'snoozed',
        note:
          'snoozed until ' +
          label
            .replace(/^Later today/, 'today')
            .replace(/^Tomorrow/, 'tomorrow'),
      }),
  });
  const empty = (
    <AllDone
      done={counts.done}
      total={counts.actions}
      know={counts.know}
      aside={counts.aside}
      snoozed={counts.snoozed}
    />
  );

  const defaultAccount =
    persona.accounts.find((account) => !account.minority) ??
    persona.accounts[0];
  const accountFor = (id?: string) =>
    persona.accounts.find((account) => account.id === id) ?? defaultAccount;
  const minorityAccount = (id?: string) => {
    const account = accountFor(id);
    return account.minority ? account : undefined;
  };

  return (
    <main
      className={[styles.page, desktop && styles.desktop]
        .filter(Boolean)
        .join(' ')}
    >
      <header className={styles.header}>
        <div className={styles.brand}>
          <Text variant="body" className={styles.wordmark}>
            <Icon name="star" className={styles.star} />
            glance
          </Text>
          <Avatar initial={persona.initial} label={persona.name} />
        </div>
        <div className={styles.greeting}>
          <Text as="p" variant="meta">
            {persona.date}
          </Text>
          <Text as="h1" variant="display">
            {persona.greeting}
          </Text>
          <Text as="p" variant="body" className={styles.coverage}>
            {persona.coverage.text.replace('{n}', String(counts.covered))}
          </Text>
          {persona.coverage.note && (
            <Text as="p" variant="meta" className={styles.accountNote}>
              <Icon name="moon" />
              {persona.coverage.note}
            </Text>
          )}
        </div>
      </header>
      {children ?? (
        <div className={styles.layout}>
          <div className={styles.list}>
            <SectionCard
              title="Needs you"
              count={counts.needs}
              rightSlot={
                <div className={styles.progress}>
                  <Text
                    variant="meta"
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {counts.done + ' of ' + counts.actions + ' done'}
                  </Text>
                  <div className={styles.progressBar}>
                    <ProgressBar
                      value={counts.actions ? counts.done / counts.actions : 0}
                    />
                  </div>
                </div>
              }
            >
              {items.map((item, index) => (
                <BriefRow
                  key={item.id}
                  item={item}
                  rank={index + 1}
                  account={minorityAccount(item.account)}
                  selected={(desktop || sheetOpen) && item.id === selected?.id}
                  leaving={life.pending?.id === item.id}
                  onLeaveComplete={() => life.settle(item.id)}
                  onSelect={(id, trigger) => {
                    setSelectedId(id);
                    setSheetItem(items.find((item) => item.id === id)!);
                    setSheetPosition(
                      items.findIndex((item) => item.id === id) + 1,
                    );
                    setSheetTotal(counts.needs);
                    if (!desktop || id !== selectedId)
                      setSelectionRevision((value) => value + 1);
                    setReturnFocus(trigger);
                    if (!desktop) setSheetOpen(true);
                  }}
                />
              ))}
              {persona.doneBefore.map((item) => (
                <DoneRow key={item.name} {...item} />
              ))}
              {Object.entries(life.records).map(([id, result]) => {
                const item = persona.items.find((item) => item.id === id)!;
                return (
                  <DoneRow
                    key={id + ':' + result.kind + ':' + result.note}
                    undoDisabled={!!life.pending}
                    name={item.name}
                    kind={result.kind}
                    note={result.note}
                    undoRef={(button) => {
                      if (button) undoRefs.current.set(id, button);
                      else undoRefs.current.delete(id);
                    }}
                    onUndo={() => undo(id)}
                  />
                );
              })}
            </SectionCard>
            {!desktop && !items.length && empty}
            <SectionCard title="Good to know" count={counts.know}>
              {persona.goodToKnow.map((item) => (
                <KnowRow
                  key={item.title}
                  item={item}
                  account={minorityAccount(item.account)}
                  onOpenEmail={() => openInbox(accountFor(item.account))}
                />
              ))}
            </SectionCard>
            <CollapsedGroup
              groups={
                movedCount
                  ? [
                      { count: movedCount, short: 'moved by you' },
                      ...persona.setAside,
                    ]
                  : persona.setAside
              }
              static
            />
          </div>
          {desktop && selected && (
            <div className={styles.detail}>
              <DetailPanel
                key={selected.id + ':' + selectionRevision}
                {...detailActions(selected.id)}
                item={selected}
                position={items.indexOf(selected) + 1}
                total={counts.needs}
                account={accountFor(selected.account)}
                initialFactId={
                  !startClean && !life.started && selectionRevision === 0
                    ? selected.facts[
                        persona.demo.initialSelection.openFactIndex
                      ]?.id
                    : undefined
                }
                initialReasonOpen={
                  !startClean &&
                  !life.started &&
                  selectionRevision === 0 &&
                  persona.demo.initialSelection.reasonOpen
                }
              />
            </div>
          )}
          {desktop && !items.length && (
            <div className={styles.detail}>{empty}</div>
          )}
        </div>
      )}
      {!desktop && sheetItem && !children && (
        <DetailSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          returnFocus={returnFocus}
          label={sheetItem.name}
        >
          <DetailPanel
            key={sheetItem.id + ':' + selectionRevision}
            {...detailActions(sheetItem.id)}
            item={sheetItem}
            position={sheetPosition}
            total={sheetTotal}
            account={accountFor(sheetItem.account)}
            mobile
            onClose={() => setSheetOpen(false)}
          />
        </DetailSheet>
      )}
    </main>
  );
}

export function App({
  personaId,
  children,
  startClean = false,
  session,
}: {
  personaId: PersonaId;
  children?: ReactNode;
  startClean?: boolean;
  session?: ItemLifecycle;
}) {
  return (
    <Brief
      key={personaId}
      personaId={personaId}
      startClean={startClean}
      session={session}
    >
      {children}
    </Brief>
  );
}
