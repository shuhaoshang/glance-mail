import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
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
import {
  movedRow,
  type EmailOrigin,
  type EmailTab,
} from '../design-system/components/MailRows/movedEmail';
import { ToastProvider } from '../design-system/components/Toast/ToastProvider';
import { useToast } from '../design-system/components/Toast/toastContext';
import styles from './App.module.css';

type BriefTab = 'needs-you' | 'heads-up' | 'other-mail';
function emailName(email: EmailOrigin) {
  return email.kind === 'needs-you'
    ? email.item.name
    : email.kind === 'heads-up'
      ? email.item.title
      : email.item.sender;
}
const labels: Record<BriefTab, EmailTab> = {
  'needs-you': 'Needs you',
  'heads-up': 'Heads-up',
  'other-mail': 'Other mail',
};

function Brief({
  personaId,
  children,
  startClean = false,
  session,
  onToastSurface,
}: {
  personaId: PersonaId;
  children?: ReactNode;
  startClean?: boolean;
  session?: ItemLifecycle;
  onToastSurface: (
    container: HTMLElement | null,
    actionBar: HTMLElement | null,
  ) => void;
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
  const rows = life.rows;
  const items = rows['needs-you'];
  const other = rows['other-mail'];
  const appRoot = useRef<HTMLElement>(null);
  const { showToast, dismissToast } = useToast();
  const moveUi = useRef<{
    tab: BriefTab;
    selections: Partial<Record<BriefTab, string>>;
    next?: string;
    id: string;
    position: { position: number; total: number };
  } | null>(null);
  const shownMove = useRef(0);
  const selected = (key: BriefTab) =>
    rows[key].find((email) => email.item.id === selections[key])?.item.id ??
    (desktop ? rows[key][0]?.item.id : undefined);
  const selectedId = selected(tab);
  const counts = life.counts;
  const [previousDesktop, setPreviousDesktop] = useState(desktop);
  if (previousDesktop !== desktop) {
    setPreviousDesktop(desktop);
    setSheetOpen(false);
  }

  // An offscreen row has no collapse animation to finish.
  useEffect(() => {
    if (life.pending && (tab !== life.pending.source || children))
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

  useLayoutEffect(() => {
    const dialog =
      !desktop && sheetOpen && !children
        ? (appRoot.current?.querySelector<HTMLDialogElement>('dialog[open]') ??
          null)
        : null;
    onToastSurface(
      dialog,
      dialog?.querySelector<HTMLElement>('[data-detail-actions]') ?? null,
    );
  }, [desktop, sheetOpen, children, tab, selectedId, onToastSurface]);
  const rowElement = useCallback(
    (key: BriefTab, id?: string) => {
      return Array.from(
        document
          .getElementById(prefix + '-' + key)
          ?.querySelectorAll<HTMLButtonElement>(
            '[data-brief-item], [data-mail-item]',
          ) ?? [],
      ).find(
        (node) => (node.dataset.briefItem ?? node.dataset.mailItem) === id,
      );
    },
    [prefix],
  );
  function afterSheetsClose(action: () => void) {
    requestAnimationFrame(function wait() {
      if (!appRoot.current?.isConnected) return;
      if (document.querySelector('dialog[open]')) requestAnimationFrame(wait);
      else action();
    });
  }
  function moveEmail(source: BriefTab, id: string, destination: BriefTab) {
    if (life.pending || source === destination) return;
    const index = rows[source].findIndex((email) => email.item.id === id);
    const remaining = rows[source].filter((email) => email.item.id !== id);
    moveUi.current = {
      tab: source,
      selections: { ...selections, [source]: id },
      id,
      next: (remaining[index] ?? remaining[0])?.item.id,
      position: sheetPosition,
    };
    dismissToast();
    life.move(id, destination);
    setSheetOpen(false);
  }
  useEffect(() => {
    const receipt = life.lastMove;
    if (!receipt || shownMove.current === receipt.sequence) return;
    shownMove.current = receipt.sequence;
    const before = moveUi.current;
    if (!before) return;
    setSelections((current) => ({ ...current, [receipt.from]: before.next }));
    afterSheetsClose(() => {
      const target =
        rowElement(tab, tab === receipt.from ? before.next : selectedId) ??
        document.getElementById(prefix + '-' + tab + '-tab');
      target?.focus({ preventScroll: true });
      showToast({
        title: 'Moved to ' + labels[receipt.to] + '.',
        description:
          'Glance will sort emails like this into ' + labels[receipt.to] + '.',
        returnFocus: target,
        onUndo: () => {
          life.undoMove(receipt);
          setSheetOpen(false);
          afterSheetsClose(() => {
            setTab(before.tab);
            setSelections(before.selections);
            setSheetPosition(before.position);
            requestAnimationFrame(() =>
              rowElement(before.tab, before.id)?.focus({ preventScroll: true }),
            );
          });
        },
      });
    });
  }, [life, showToast, tab, selectedId, prefix, rowElement]);

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
      position: rows[key].findIndex((email) => email.item.id === id) + 1,
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
  const watchlistFor = (id?: string) => {
    const entry = persona.watchlist.find((watch) => watch.id === id);
    return entry ? { name: entry.name } : undefined;
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
  const detailProps = (key: BriefTab): DetailPanelProps[] =>
    life.emails
      .filter(
        (email) =>
          (email.kind === key || life.seen[email.item.id]?.includes(key)) &&
          (!('isNew' in email.item) || !email.item.isNew || life.newAdded),
      )
      .map((email) => {
        const item = email.item;
        const common = {
          ...(key === 'needs-you' ? detailActions(item.id) : {}),
          busy: !!life.pending,
          currentTab: key,
          onMoveTo: (destination: BriefTab) =>
            moveEmail(key, item.id, destination),
          movedTo: email.kind === key ? undefined : labels[key],
          position: Math.max(
            1,
            rows[key].findIndex((entry) => entry.item.id === item.id) + 1,
          ),
          total: key === 'other-mail' ? counts.other : rows[key].length,
          account: accountFor('account' in item ? item.account : undefined),
          watchlist: watchlistFor('watch' in item ? item.watch : undefined),
        };
        if (email.kind === 'needs-you')
          return {
            ...common,
            item: email.item,
            checkedSteps: life.checks[item.id] ?? [],
            onChecksChange: (values: boolean[]) => life.check(item.id, values),
            askedQuestions: life.asked[item.id] ?? [],
            onAskQuestion: (index: number) => life.ask(item.id, index),
            initialFactId:
              !startClean &&
              desktop &&
              key === email.kind &&
              item.id === persona.items[0]?.id
                ? email.item.facts[persona.demo.initialSelection.openFactIndex]
                    ?.id
                : undefined,
            initialReasonOpen:
              !startClean &&
              desktop &&
              key === email.kind &&
              item.id === persona.items[0]?.id &&
              persona.demo.initialSelection.reasonOpen,
          };
        return email.kind === 'heads-up'
          ? { ...common, variant: 'heads-up', item: email.item }
          : { ...common, variant: 'other-mail', item: email.item };
      });
  const tabCounts = {
    'needs-you': counts.needs,
    'heads-up': counts.know,
    'other-mail': counts.other,
  };
  return (
    <main
      ref={appRoot}
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
                  {items.map((email, index) => (
                    <BriefRow
                      key={email.item.id}
                      item={email.kind === key ? email.item : movedRow(email)}
                      rank={index + 1}
                      account={minorityAccount(
                        'account' in email.item
                          ? email.item.account
                          : undefined,
                      )}
                      selected={
                        (desktop || sheetOpen) &&
                        email.item.id === selected(key)
                      }
                      leaving={life.pending?.id === email.item.id}
                      onLeaveComplete={() => life.settle(email.item.id)}
                      onSelect={(id, trigger) => selectRow(key, id, trigger)}
                    />
                  ))}
                  {!items.length && (
                    <div role="listitem">
                      <AllDone
                        wording="tabs"
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
                  {Object.entries(life.records)
                    .filter(([id]) => life.orders['needs-you'].includes(id))
                    .map(([id, result]) => (
                      <DoneRow
                        key={id + ':' + result.kind + ':' + result.note}
                        undoDisabled={!!life.pending}
                        name={emailName(
                          life.emails.find((email) => email.item.id === id)!,
                        )}
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
                <MailList tab="Heads-up" empty={!rows['heads-up'].length}>
                  {rows['heads-up'].map((email) => (
                    <HeadsUpRow
                      key={email.item.id}
                      item={email.kind === key ? email.item : movedRow(email)}
                      leaving={life.pending?.id === email.item.id}
                      onLeaveComplete={() => life.settle(email.item.id)}
                      account={minorityAccount(
                        'account' in email.item
                          ? email.item.account
                          : undefined,
                      )}
                      selected={
                        (desktop || sheetOpen) &&
                        email.item.id === selected(key)
                      }
                      onSelect={(id, trigger) => selectRow(key, id, trigger)}
                    />
                  ))}
                </MailList>
              )}
              {key === 'other-mail' && (
                <OtherMailList
                  items={other.map((email) =>
                    email.kind === key ? email.item : movedRow(email),
                  )}
                  pendingId={life.pending?.id}
                  onLeaveComplete={life.settle}
                  total={counts.other}
                  selected={desktop || sheetOpen ? selected(key) : undefined}
                  onSelect={(id, trigger) => selectRow(key, id, trigger)}
                />
              )}
            </div>
            {detailProps(key).map((props) => {
              const active =
                life.location(props.item.id) === key &&
                props.item.id === selected(key);
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
  const [surface, setSurface] = useState<{
    container: HTMLElement | null;
    actionBar: HTMLElement | null;
  }>({ container: null, actionBar: null });
  const onToastSurface = useCallback(
    (container: HTMLElement | null, actionBar: HTMLElement | null) => {
      setSurface((current) =>
        current.container === container && current.actionBar === actionBar
          ? current
          : { container, actionBar },
      );
    },
    [],
  );
  return (
    <ToastProvider key={props.personaId} {...surface}>
      <Brief key={props.personaId} {...props} onToastSurface={onToastSurface} />
    </ToastProvider>
  );
}
