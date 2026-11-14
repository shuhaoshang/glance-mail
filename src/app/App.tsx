import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { getPersona, type PersonaId } from '../data';
import { Text } from '../design-system/components/Text/Text';
import { Icon } from '../design-system/components/Icon/Icon';
import { Avatar } from '../design-system/components/Avatar/Avatar';
import { DetailSheet } from '../design-system/components/DetailSheet/DetailSheet';
import {
  DetailPanel,
  type DetailPanelProps,
} from '../design-system/components/DetailPanel/DetailPanel';
import { BriefRow } from '../design-system/components/BriefRow/BriefRow';
import { HeadsUpRow } from '../design-system/components/HeadsUpRow/HeadsUpRow';
import {
  MailList,
  OtherMailList,
} from '../design-system/components/MailList/MailList';
import { TabBar } from '../design-system/components/TabBar/TabBar';
import { DoneRow } from '../design-system/components/DoneRow/DoneRow';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import {
  useItemLifecycle,
  type ItemLifecycle,
  type Resolution,
} from './useItemLifecycle';
import { NewMailRow } from '../design-system/components/NewMailRow/NewMailRow';
import { AllDone } from '../design-system/components/AllDone/AllDone';
import styles from './App.module.css';

type BriefTab = 'needs-you' | 'heads-up' | 'other-mail';
const labels: Record<BriefTab, string> = {
  'needs-you': 'Needs you',
  'heads-up': 'Heads-up',
  'other-mail': 'Other mail',
};

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
  const desktop = useDesktopLayout();
  const prefix = useId();
  const [tab, setTab] = useState<BriefTab>('needs-you');
  const [selections, setSelections] = useState<
    Partial<Record<BriefTab, string>>
  >({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetPosition, setSheetPosition] = useState({ position: 1, total: 1 });
  const [returnFocus, setReturnFocus] = useState<HTMLElement | null>(null);
  const [focusResult, setFocusResult] = useState<string | null>(null);
  const undoRefs = useRef(new Map<string, HTMLButtonElement>());
  const items = life.active;
  const other = persona.otherMail.rows.filter(
    (row) => !row.isNew || life.newAdded,
  );
  const rows = {
    'needs-you': items,
    'heads-up': persona.goodToKnow,
    'other-mail': other,
  };
  const selected = (key: BriefTab) =>
    rows[key].find((item) => item.id === selections[key])?.id ??
    (desktop ? rows[key][0]?.id : undefined);
  const selectedId = selected(tab);
  const counts = life.counts;
  const [previousDesktop, setPreviousDesktop] = useState(desktop);
  if (previousDesktop !== desktop) {
    setPreviousDesktop(desktop);
    setSheetOpen(false);
  }

  // An offscreen row has no collapse animation to finish.
  useEffect(() => {
    if (life.pending && (tab !== 'needs-you' || children))
      life.settle(life.pending.id);
  }, [life, tab, children]);

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
  function selectRow(key: BriefTab, id: string, trigger: HTMLButtonElement) {
    setSelections((current) => ({ ...current, [key]: id }));
    setReturnFocus(trigger);
    setSheetPosition({
      position: rows[key].findIndex((item) => item.id === id) + 1,
      total: key === 'other-mail' ? counts.other : rows[key].length,
    });
    if (!desktop) setSheetOpen(true);
  }
  function selectTab(key: BriefTab) {
    // Save the automatically selected desktop row before leaving its tab.
    if (desktop)
      setSelections((current) => ({ ...current, [tab]: selectedId }));
    setTab(key);
    setSheetOpen(false);
  }
  const defaultAccount = persona.accounts.find((account) => !account.minority)!;
  const accountFor = (id?: string) =>
    persona.accounts.find((account) => account.id === id) ?? defaultAccount;
  const minorityAccount = (id?: string) => {
    const account = accountFor(id);
    return account.minority ? account : undefined;
  };
  const detailActions = (id: string) => ({
    busy: !!life.pending,
    checkedSteps: life.checks[id] ?? [],
    askedQuestions: life.asked[id] ?? [],
    onAskQuestion: (index: number) => life.ask(id, index),
    onChecksChange: (values: boolean[]) => life.check(id, values),
    onDone: () => act(id, { kind: 'done', note: 'marked done in Glance' }),
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
  const detailProps = (key: BriefTab): DetailPanelProps[] => {
    if (key === 'needs-you')
      return persona.items
        .filter((item) => !item.isNew || life.newAdded)
        .map((item) => ({
          ...detailActions(item.id),
          item,
          account: accountFor(item.account),
          position: Math.max(
            1,
            items.findIndex((entry) => entry.id === item.id) + 1,
          ),
          total: counts.needs,
          initialFactId:
            !startClean && desktop && item.id === persona.items[0]?.id
              ? item.facts[persona.demo.initialSelection.openFactIndex]?.id
              : undefined,
          initialReasonOpen:
            !startClean &&
            desktop &&
            item.id === persona.items[0]?.id &&
            persona.demo.initialSelection.reasonOpen,
        }));
    if (key === 'heads-up')
      return persona.goodToKnow.map((item, index) => ({
        variant: 'heads-up',
        item,
        account: accountFor(item.account),
        position: index + 1,
        total: counts.know,
      }));
    return other.map((item, index) => ({
      variant: 'other-mail',
      item,
      account: defaultAccount,
      position: index + 1,
      total: counts.other,
    }));
  };
  const tabCounts = {
    'needs-you': counts.needs,
    'heads-up': counts.know,
    'other-mail': counts.other,
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
          <Text as="p" variant="meta" className={styles.date}>
            {persona.date}
          </Text>
          <Text as="h1" variant="greeting">
            {persona.greeting}
          </Text>
          <Text
            as="p"
            variant={desktop ? 'body' : 'meta'}
            className={styles.coverage}
          >
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
      {children}
      <div hidden={!!children} className={styles.brief}>
        <TabBar
          left={(Object.keys(labels) as BriefTab[]).map((key) => ({
            id: prefix + '-' + key,
            label: labels[key],
            count: tabCounts[key],
          }))}
          selected={prefix + '-' + tab}
          onSelect={(id) => selectTab(id.slice(prefix.length + 1) as BriefTab)}
        />
        {(Object.keys(labels) as BriefTab[]).map((key) => (
          <div
            key={key}
            role="tabpanel"
            id={prefix + '-' + key}
            aria-labelledby={prefix + '-' + key + '-tab'}
            hidden={tab !== key}
            className={styles.layout}
          >
            <div className={styles.list}>
              {key === 'needs-you' && (
                <MailList
                  tab="Needs you"
                  progress={{ done: counts.done, total: counts.actions }}
                >
                  {persona.newMail && (
                    <NewMailRow
                      label={
                        life.newAdded
                          ? persona.newMail.added
                          : persona.newMail.label
                      }
                      added={life.newAdded}
                      onAdd={() => {
                        life.addMail();
                        const id = persona.items.find((item) => item.isNew)?.id;
                        requestAnimationFrame(() =>
                          Array.from(
                            document.querySelectorAll<HTMLButtonElement>(
                              '[data-brief-item]',
                            ),
                          )
                            .find((button) => button.dataset.briefItem === id)
                            ?.focus({ preventScroll: true }),
                        );
                      }}
                    />
                  )}
                  {items.map((item, index) => (
                    <BriefRow
                      key={item.id}
                      item={item}
                      rank={index + 1}
                      account={minorityAccount(item.account)}
                      selected={
                        (desktop || sheetOpen) && item.id === selected(key)
                      }
                      leaving={life.pending?.id === item.id}
                      onLeaveComplete={() => life.settle(item.id)}
                      onSelect={(id, trigger) => selectRow(key, id, trigger)}
                    />
                  ))}
                  {!items.length && (
                    <div role="listitem">
                      <AllDone
                        done={counts.done}
                        total={counts.actions}
                        know={counts.know}
                        aside={counts.other}
                        snoozed={counts.snoozed}
                      />
                    </div>
                  )}
                  {persona.doneBefore.map((item) => (
                    <DoneRow key={item.name} {...item} />
                  ))}
                  {Object.entries(life.records).map(([id, result]) => (
                    <DoneRow
                      key={id + ':' + result.kind + ':' + result.note}
                      undoDisabled={!!life.pending}
                      name={persona.items.find((item) => item.id === id)!.name}
                      kind={result.kind}
                      note={result.note}
                      undoRef={(button) => {
                        if (button) undoRefs.current.set(id, button);
                        else undoRefs.current.delete(id);
                      }}
                      onUndo={() => undo(id)}
                    />
                  ))}
                </MailList>
              )}
              {key === 'heads-up' && (
                <MailList tab="Heads-up" empty={!persona.goodToKnow.length}>
                  {persona.goodToKnow.map((item) => (
                    <HeadsUpRow
                      key={item.id}
                      item={item}
                      account={minorityAccount(item.account)}
                      selected={
                        (desktop || sheetOpen) && item.id === selected(key)
                      }
                      onSelect={(id, trigger) => selectRow(key, id, trigger)}
                    />
                  ))}
                </MailList>
              )}
              {key === 'other-mail' && (
                <OtherMailList
                  items={other}
                  total={counts.other}
                  selected={desktop || sheetOpen ? selected(key) : undefined}
                  onSelect={(id, trigger) => selectRow(key, id, trigger)}
                />
              )}
            </div>
            {detailProps(key).map((props) => {
              const active = props.item.id === selected(key);
              const panel = (
                <DetailPanel
                  {...props}
                  {...(!desktop ? sheetPosition : {})}
                  mobile={!desktop}
                  onClose={() => setSheetOpen(false)}
                />
              );
              // Keep each item's detail mounted so tabs retain source, reasoning,
              // email-highlighter, and view state as well as session-owned answers.
              return desktop ? (
                <div
                  key={props.item.id}
                  hidden={!active}
                  className={styles.detail}
                >
                  {panel}
                </div>
              ) : (
                <DetailSheet
                  key={props.item.id}
                  open={!children && tab === key && active && sheetOpen}
                  onClose={() => setSheetOpen(false)}
                  returnFocus={returnFocus}
                  label={
                    'name' in props.item
                      ? props.item.name
                      : 'title' in props.item
                        ? props.item.title
                        : props.item.subject
                  }
                >
                  {panel}
                </DetailSheet>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}

export function App(props: {
  personaId: PersonaId;
  children?: ReactNode;
  startClean?: boolean;
  session?: ItemLifecycle;
}) {
  return <Brief key={props.personaId} {...props} />;
}
