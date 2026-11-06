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
import { ordinal } from '../ReasonPanel/reasonText';
import { AskThread } from '../AskThread/AskThread';
import { EmailView } from '../EmailView/EmailView';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { SnoozeMenu } from '../SnoozeMenu/SnoozeMenu';
import { firstFieldForFact, inboxUrls } from './detailSelection';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  item: Item;
  position: number;
  total: number;
  account: Account;
  mobile?: boolean;
  onClose?: () => void;
  initialFactId?: string;
  initialReasonOpen?: boolean;
  onDone?: () => void;
  onSnooze?: (label: string) => void;
  onMoveAside?: () => void;
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
  onDone,
  onSnooze,
  onMoveAside,
  busy,
  checkedSteps,
  onChecksChange,
}: DetailPanelProps) {
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

  const [highlighted, setHighlighted] = useState(true);
  const [reasonOpen, setReasonOpen] = useState(initialReasonOpen);
  const [selection, setSelection] = useState<SceneFieldSelection | null>(() => {
    const fact = item.facts.find((entry) => entry.id === initialFactId);
    const fieldKey = firstFieldForFact(item, initialFactId);
    return fact && fieldKey ? { fact, fieldKey, trigger: null } : null;
  });
  const tabs = (
    <SegmentedControl
      aria-label="Item views"
      options={[
        { value: 'details', label: 'Details', panelId: detailsId },
        { value: 'email', label: 'Original email', panelId: emailId },
        { value: 'ask', label: 'Ask', panelId: askId },
      ]}
      value={tab}
      onValueChange={(value) => {
        setSnoozeOpen(false);
        setTab(value as 'details' | 'email' | 'ask');
      }}
    />
  );
  function showAsk() {
    setSnoozeOpen(false);
    setTab('ask');
    requestAnimationFrame(() =>
      document.getElementById(askId + '-tab')?.focus(),
    );
  }
  function showEmail() {
    setTab('email');
    requestAnimationFrame(() =>
      document.getElementById(emailId + '-tab')?.focus(),
    );
  }
  return (
    <section
      ref={root}
      aria-label="Selected item"
      onKeyDown={(event) => {
        if (snoozeOpen && event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          closeSnooze();
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
              {'Needs you · ' + position + ' of ' + total}
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
        {(!mobile || tab === 'details') && (
          <div className={styles.identity}>
            <Text as="h2" variant="title" className={styles.title}>
              {item.name}
            </Text>
            <div className={styles.person}>
              <Person {...item.person} />
              {account.minority && <AccountLabel account={account} />}
            </div>
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
                  const trigger =
                    selection.trigger ??
                    root.current?.querySelector<HTMLButtonElement>(
                      'button[aria-expanded="true"][aria-controls="' +
                        sourceId +
                        '"]',
                    );
                  setSelection(null);
                  trigger?.focus();
                }}
              />
            )}
          </div>
          <div className={styles.reason}>
            <ReasonPill
              mobile={mobile}
              label={[
                'Glance’s read: Ranked ' + ordinal(position),
                ...item.judgments.map((entry) => entry.label),
                reasonOpen ? 'Hide' : 'Why?',
              ].join(' · ')}
              expanded={reasonOpen}
              controls={reasonId}
              onToggle={() => setReasonOpen((value) => !value)}
            />
            {reasonOpen && (
              <ReasonPanel
                item={item}
                position={position}
                id={reasonId}
                onMoveAside={onMoveAside}
                disabled={busy}
              />
            )}
          </div>
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
          <AskThread item={item} />
        </div>
      </div>
      <div className={styles.actionArea}>
        {snoozeOpen && !complete && onSnooze && (
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
          className={[styles.actions, complete && styles.complete]
            .filter(Boolean)
            .join(' ')}
        >
          <Button
            className={styles.inbox}
            size={mobile && complete && onDone ? 'touch' : undefined}
            variant={complete && onDone ? 'neutral' : 'primary'}
            href={inboxUrls[account.app]}
            target="_blank"
            rel="noopener noreferrer"
            external
          >
            Open in {account.app}
          </Button>
          {tab !== 'ask' && (
            <Button
              variant="tint"
              size={mobile ? 'touch' : undefined}
              leadingIcon="message"
              onClick={showAsk}
            >
              Ask
            </Button>
          )}
          {!complete && onSnooze && (
            <Button
              ref={snoozeTrigger}
              className={styles.snoozeTrigger}
              size={mobile ? 'touch' : undefined}
              variant="neutral"
              leadingIcon="clock"
              aria-expanded={snoozeOpen}
              aria-controls={snoozeId}
              disabled={busy}
              onClick={() => {
                if (snoozeOpen) closeSnooze();
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
          )}
          {onDone && (
            <Button
              className={styles.done}
              size={mobile && !complete ? 'touch' : undefined}
              variant={complete ? 'primary' : 'neutral'}
              leadingIcon="check"
              disabled={busy}
              onClick={onDone}
            >
              {complete ? 'Mark done' : 'Done'}
            </Button>
          )}
        </footer>
      </div>
    </section>
  );
}
export function DetailPanel(props: DetailPanelProps) {
  return <Content key={props.item.id} {...props} />;
}
