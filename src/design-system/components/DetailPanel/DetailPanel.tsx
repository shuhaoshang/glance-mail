import { useId, useRef, useState } from 'react';
import type { Account, Item } from '../../../data/types';
import { Text } from '../Text/Text';
import { Person } from '../Person/Person';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { SceneCard, type SceneFieldSelection } from '../SceneCard/SceneCard';
import { SourcePanel } from '../SourcePanel/SourcePanel';
import { ReasonPill } from '../ReasonPill/ReasonPill';
import { ReasonPanel } from '../ReasonPanel/ReasonPanel';
import { reasonLabel } from '../ReasonPanel/reasonText';
import { AskThread } from '../AskThread/AskThread';
import { EmailView } from '../EmailView/EmailView';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { SnoozeMenu } from '../SnoozeMenu/SnoozeMenu';
import { firstFieldForFact, inboxUrls } from './detailSelection';
import { MailDetails, MovedNote, type MailDetailProps } from './MailDetails';
import type { EmailTab } from '../MailRows/movedEmail';
import { MoveMenu, type Destination } from '../MoveMenu/MoveMenu';
import { useActionLayout } from './useActionLayout';
import styles from './DetailPanel.module.css';

export interface NeedsYouDetailProps {
  variant?: 'needs-you';
  movedTo?: EmailTab;
  currentTab?: Destination;
  onMoveTo?: (destination: Destination) => void;
  item: Item;
  position: number;
  total: number;
  account: Account;
  mobile?: boolean;
  onClose?: () => void;
  initialFactId?: string;
  initialReasonOpen?: boolean;
  askedQuestions?: number[];
  onAskQuestion?: (index: number) => void;
  onDone?: () => void;
  onSnooze?: (label: string) => void;
  watchlist?: { name: string; onOpen?: () => void };
  busy?: boolean;
  checkedSteps?: boolean[];
  onChecksChange?: (values: boolean[]) => void;
  initialTab?: 'details' | 'email' | 'ask';
}
function Content({
  item,
  position,
  total,
  account,
  mobile = false,
  onClose,
  initialFactId,
  initialReasonOpen = false,
  initialTab = 'details',
  movedTo,
  currentTab = 'needs-you',
  onMoveTo,
  askedQuestions,
  onAskQuestion,
  onDone,
  onSnooze,
  watchlist,
  busy,
  checkedSteps,
  onChecksChange,
}: NeedsYouDetailProps) {
  const prefix = useId(),
    sourceId = prefix + '-source',
    reasonId = prefix + '-reason';
  const detailsId = prefix + '-details',
    emailId = prefix + '-email';
  const askId = prefix + '-ask';
  const root = useRef<HTMLElement>(null);
  const [tab, setTab] = useState(initialTab);
  const [localChecks, setLocalChecks] = useState<boolean[]>([]);
  const checks = checkedSteps ?? localChecks;
  const complete =
    item.scene.type === 'checklist' &&
    item.scene.steps.length > 0 &&
    item.scene.steps.every((_, index) => checks[index]);
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const snoozeId = prefix + '-snooze';
  const snoozeTrigger = useRef<HTMLButtonElement>(null);
  function closeSnooze() {
    setSnoozeOpen(false);
    snoozeTrigger.current?.focus();
  }

  const {
    bar: actionBar,
    setBar: setActionBar,
    stacked: stackedActions,
  } = useActionLayout(
    mobile,
    [account.app, complete, !!onDone, !!onSnooze, !!onMoveTo, movedTo].join(
      ':',
    ),
  );
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTrigger, setMoveTrigger] = useState<HTMLButtonElement | null>(
    null,
  );
  const moveId = prefix + '-move';
  const [highlighted, setHighlighted] = useState(true);
  const reasonTrigger = useRef<HTMLButtonElement>(null);
  const [reasonOpen, setReasonOpen] = useState(initialReasonOpen && !movedTo);
  const [selection, setSelection] = useState<SceneFieldSelection | null>(() => {
    const fact = item.facts.find((entry) => entry.id === initialFactId);
    const fieldKey = firstFieldForFact(item, initialFactId);
    return fact && fieldKey ? { fact, fieldKey, trigger: null } : null;
  });
  function closeSource() {
    if (!selection) return;
    const trigger =
      selection.trigger ??
      root.current?.querySelector<HTMLButtonElement>(
        'button[aria-expanded="true"][aria-controls="' + sourceId + '"]',
      );
    setSelection(null);
    trigger?.focus();
  }
  const tabs = (
    <SegmentedControl
      aria-label="Item views"
      appearance={mobile ? 'underline' : 'segmented'}
      options={[
        { value: 'details', label: 'Details', panelId: detailsId },
        { value: 'email', label: 'Original email', panelId: emailId },
        { value: 'ask', label: 'Ask', panelId: askId },
      ]}
      value={tab}
      onValueChange={(value) => {
        setSnoozeOpen(false);
        setMoveOpen(false);
        setTab(value as 'details' | 'email' | 'ask');
      }}
    />
  );
  function showEmail() {
    setTab('email');
    requestAnimationFrame(() =>
      document.getElementById(emailId + '-tab')?.focus(),
    );
  }
  const markDonePrimary =
    complete && !!onDone && (!movedTo || movedTo === 'Needs you');
  const inboxAction = (
    <Button
      key="inbox"
      className={styles.inbox}
      size={
        complete && onDone && (!movedTo || movedTo === 'Needs you')
          ? mobile
            ? 'touch'
            : 'compact'
          : undefined
      }
      variant={
        complete && onDone && (!movedTo || movedTo === 'Needs you')
          ? 'outline'
          : 'primary'
      }
      href={inboxUrls[account.app]}
      target="_blank"
      rel="noopener noreferrer"
      external
    >
      Open in {account.app}
    </Button>
  );
  const snoozeAction = (!movedTo || movedTo === 'Needs you') &&
    !complete &&
    onSnooze && (
      <Button
        ref={snoozeTrigger}
        className={styles.snoozeTrigger}
        size={mobile ? 'touch' : 'compact'}
        variant="outline"
        leadingIcon="clock"
        aria-expanded={snoozeOpen}
        aria-controls={snoozeId}
        disabled={busy}
        onClick={() => {
          if ((!movedTo || movedTo === 'Needs you') && snoozeOpen)
            closeSnooze();
          else {
            setSnoozeOpen(true);
            requestAnimationFrame(() =>
              document
                .getElementById(snoozeId)
                ?.querySelector<HTMLButtonElement>('button')
                ?.focus(),
            );
          }
        }}
      >
        Snooze
      </Button>
    );
  const doneAction = (!movedTo || movedTo === 'Needs you') && onDone && (
    <Button
      key="done"
      className={styles.done}
      size={complete ? undefined : mobile ? 'touch' : 'compact'}
      variant={complete ? 'primary' : 'outline'}
      leadingIcon="check"
      disabled={busy}
      onClick={onDone}
    >
      {complete ? 'Mark done' : 'Done'}
    </Button>
  );
  const moveAction = onMoveTo && (
    <Button
      ref={setMoveTrigger}
      variant="outline"
      size={mobile ? 'touch' : 'compact'}
      leadingIcon="move"
      trailingIcon="chevron-down"
      className={styles.moveTrigger}
      aria-haspopup="menu"
      aria-expanded={moveOpen}
      aria-controls={moveId}
      disabled={busy}
      onClick={() => {
        setSnoozeOpen(false);
        setMoveOpen((value) => !value);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          setSnoozeOpen(false);
          setMoveOpen(true);
        }
      }}
    >
      Move to
    </Button>
  );
  const primaryAction = markDonePrimary ? doneAction : inboxAction;
  const secondaryActions = (markDonePrimary ||
    snoozeAction ||
    moveAction ||
    doneAction) && (
    <div key="secondary" className={styles.secondaryActions} data-action-group>
      {markDonePrimary ? (
        <>
          {inboxAction}
          {moveAction}
        </>
      ) : (
        <>
          {snoozeAction}
          {moveAction}
          {doneAction}
        </>
      )}
    </div>
  );
  return (
    <section
      ref={root}
      aria-label="Selected item"
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        if (moveOpen) {
          event.preventDefault();
          event.stopPropagation();
          setMoveOpen(false);
          moveTrigger?.focus();
          return;
        }
        if (
          ((!movedTo || movedTo === 'Needs you') && snoozeOpen) ||
          (tab === 'details' && (selection || (!movedTo && reasonOpen)))
        ) {
          event.preventDefault();
          event.stopPropagation();
          if ((!movedTo || movedTo === 'Needs you') && snoozeOpen)
            closeSnooze();
          else if (selection) closeSource();
          else {
            setReasonOpen(false);
            reasonTrigger.current?.focus();
          }
        }
      }}
      className={[styles.panel, mobile && styles.mobile]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.body}>
        <div className={styles.navigation}>
          <div className={styles.topRow}>
            <Text variant="meta" className={styles.meta}>
              {(movedTo ?? 'Needs you') + ' · ' + position + ' of ' + total}
            </Text>
            {mobile ? (
              <IconButton
                icon="close"
                aria-label="Close detail"
                data-sheet-autofocus
                onClick={onClose}
                className={styles.close}
              />
            ) : (
              tabs
            )}
          </div>
          {mobile && tabs}
        </div>
        {(!mobile || tab === 'details' || movedTo) && (
          <div className={styles.identity}>
            <Text as="h2" variant="title" className={styles.title}>
              {item.name}
            </Text>
            <div className={styles.person}>
              <Person {...item.person} />
              {account.minority && <AccountLabel account={account} />}
            </div>
            {movedTo && <MovedNote />}
          </div>
        )}
        <div
          role="tabpanel"
          id={detailsId}
          aria-labelledby={detailsId + '-tab'}
          hidden={tab !== 'details'}
          tabIndex={0}
          className={styles.tabPanel}
        >
          <div className={styles.requestGroup}>
            {item.request.type === 'summary' ? (
              <GlanceMark showLabel />
            ) : (
              <Text variant="meta" className={styles.meta}>
                {item.request.by}
              </Text>
            )}
            <Text as="p" variant="request" className={styles.request}>
              {item.request.text}
            </Text>
          </div>
          <div className={styles.sources}>
            <Text as="p" variant="meta">
              From the email · {mobile ? 'tap' : 'select'} an underlined value
              {!mobile && ' to see where it says so'}
            </Text>
            <SceneCard
              item={item}
              mobile={mobile}
              checkedSteps={checks}
              onCheckedStepsChange={(values) => {
                setLocalChecks(values);
                if (values.every(Boolean)) setSnoozeOpen(false);
                onChecksChange?.(values);
              }}
              selectedField={selection?.fieldKey}
              sourcePanelId={sourceId}
              onSelectFact={(next) =>
                setSelection((current) =>
                  current?.fieldKey === next.fieldKey ? null : next,
                )
              }
            />
            {selection && (
              <SourcePanel
                key={selection.fieldKey}
                id={sourceId}
                from={item.from}
                when={item.when}
                source={selection.fact.source}
                kind={selection.fact.kind}
                animate={selection.trigger !== null}
                onOpenEmail={showEmail}
                onClose={() => {
                  closeSource();
                }}
              />
            )}
          </div>
          {!movedTo && (
            <div className={styles.reason}>
              <ReasonPill
                ref={reasonTrigger}
                mobile={mobile}
                label={reasonLabel(position, item.judgments[0]?.label)}
                expanded={reasonOpen}
                controls={reasonId}
                onToggle={() => setReasonOpen((value) => !value)}
              />
              {reasonOpen && (
                <ReasonPanel
                  item={item}
                  position={position}
                  id={reasonId}
                  watchlist={watchlist}
                />
              )}
            </div>
          )}
        </div>
        <div
          role="tabpanel"
          id={emailId}
          aria-labelledby={emailId + '-tab'}
          hidden={tab !== 'email'}
          tabIndex={0}
          className={styles.tabPanel}
        >
          <EmailView
            item={item}
            account={account}
            highlighted={highlighted}
            onHighlightedChange={setHighlighted}
          />
        </div>
        <div
          role="tabpanel"
          id={askId}
          aria-labelledby={askId + '-tab'}
          hidden={tab !== 'ask'}
          tabIndex={0}
          className={styles.tabPanel}
        >
          <AskThread
            item={item}
            askedQuestions={askedQuestions}
            onAskQuestion={onAskQuestion}
          />
        </div>
      </div>
      <div className={styles.actionArea}>
        {(!movedTo || movedTo === 'Needs you') &&
          snoozeOpen &&
          !complete &&
          onSnooze && (
            <div className={styles.snooze}>
              <SnoozeMenu
                id={snoozeId}
                onChoose={(label) => {
                  setSnoozeOpen(false);
                  onSnooze(label);
                }}
                onClose={closeSnooze}
              />
            </div>
          )}
        <footer
          ref={setActionBar}
          data-detail-actions
          className={[
            styles.actions,
            markDonePrimary && styles.complete,
            stackedActions && styles.stackedActions,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {markDonePrimary && !mobile && !stackedActions ? (
            <>
              {secondaryActions}
              {primaryAction}
            </>
          ) : (
            <>
              {primaryAction}
              {secondaryActions}
            </>
          )}
        </footer>
        {onMoveTo && (
          <MoveMenu
            id={moveId}
            open={moveOpen}
            current={currentTab}
            trigger={moveTrigger}
            actionBar={actionBar}
            onClose={() => setMoveOpen(false)}
            onChoose={onMoveTo}
          />
        )}
      </div>
    </section>
  );
}
export type DetailPanelProps = NeedsYouDetailProps | MailDetailProps;
export function DetailPanel(props: DetailPanelProps) {
  if (props.variant === 'heads-up' || props.variant === 'other-mail')
    return <MailDetails key={props.variant + props.item.id} {...props} />;
  return <Content key={props.item.id} {...props} />;
}
