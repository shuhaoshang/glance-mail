import { useId, useRef, useState } from 'react';
import type { Account, KnowItem, OtherMailRow } from '../../../data/types';
import type { EmailTab } from '../MailRows/movedEmail';
import { Text } from '../Text/Text';
import { Person } from '../Person/Person';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import { SourcePanel } from '../SourcePanel/SourcePanel';
import { ReasonPill } from '../ReasonPill/ReasonPill';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { EmailBody, EmailView } from '../EmailView/EmailView';
import { Highlight } from '../Highlight/Highlight';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { inboxUrls } from './detailSelection';
import { MoveMenu, type Destination } from '../MoveMenu/MoveMenu';
import { SnoozeMenu } from '../SnoozeMenu/SnoozeMenu';
import { useActionLayout } from './useActionLayout';
import styles from './DetailPanel.module.css';
import mail from './MailDetails.module.css';
export type MailDetailProps = {
  account: Account;
  position: number;
  total: number;
  mobile?: boolean;
  onClose?: () => void;
  movedTo?: EmailTab;
  currentTab?: Destination;
  onMoveTo?: (destination: Destination) => void;
  onDone?: () => void;
  onSnooze?: (label: string) => void;
  busy?: boolean;
  watchlist?: { name: string; onOpen?: () => void };
  initialTab?: 'details' | 'email';
} & (
  | { variant: 'heads-up'; item: KnowItem }
  | { variant: 'other-mail'; item: OtherMailRow }
);
export function MovedNote() {
  return (
    <Text as="p" variant="meta" className={mail.moved}>
      You moved this here. Glance will sort emails like it the same way.
    </Text>
  );
}
export function MailDetails(props: MailDetailProps) {
  const {
    account,
    position,
    total,
    mobile = false,
    onClose,
    movedTo,
    watchlist,
    currentTab = props.variant,
    onMoveTo,
    onDone,
    onSnooze,
    busy,
  } = props;
  const {
    bar: actionBar,
    setBar: setActionBar,
    stacked,
  } = useActionLayout(
    mobile,
    [account.app, currentTab, !!onMoveTo, !!onDone, !!onSnooze].join(':'),
  );
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveTrigger, setMoveTrigger] = useState<HTMLButtonElement | null>(
    null,
  );
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const snoozeTrigger = useRef<HTMLButtonElement>(null);
  const closeSnooze = () => {
    setSnoozeOpen(false);
    snoozeTrigger.current?.focus();
  };
  const prefix = useId();
  const moveId = prefix + '-move',
    snoozeId = prefix + '-snooze';
  const detailsId = prefix + '-details',
    emailId = prefix + '-email',
    reasonId = prefix + '-reason';
  const [tab, setTab] = useState(props.initialTab ?? 'details');
  const [highlighted, setHighlighted] = useState(true),
    [reasonOpen, setReasonOpen] = useState(false);
  const reason = useRef<HTMLButtonElement>(null);
  const heads = props.variant === 'heads-up' ? props.item : null;
  const other = props.variant === 'other-mail' ? props.item : null;
  const sender = heads ? heads.fact.source.from : other!.sender;
  const when = heads ? heads.fact.source.when : other!.when;
  const openEmail = () => {
    setMoveOpen(false);
    setSnoozeOpen(false);
    setTab('email');
    requestAnimationFrame(() =>
      document.getElementById(emailId + '-tab')?.focus(),
    );
  };
  const tabs = heads && (
    <SegmentedControl
      aria-label="Item views"
      appearance={mobile ? 'underline' : 'segmented'}
      value={tab}
      options={[
        { value: 'details', label: 'Details', panelId: detailsId },
        { value: 'email', label: 'Original email', panelId: emailId },
      ]}
      onValueChange={(value) => {
        setMoveOpen(false);
        setSnoozeOpen(false);
        setTab(value as 'details' | 'email');
      }}
    />
  );
  const kinds = new Set(
    other?.paras
      .flat()
      .flatMap((segment) =>
        typeof segment === 'string' ? [] : [segment.kind],
      ),
  );
  return (
    <section
      aria-label="Selected item"
      className={[styles.panel, mail.variant, mobile && styles.mobile]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && (moveOpen || snoozeOpen)) {
          event.preventDefault();
          event.stopPropagation();
          if (moveOpen) {
            setMoveOpen(false);
            moveTrigger?.focus();
          } else closeSnooze();
          return;
        }
        if (
          event.key === 'Escape' &&
          !movedTo &&
          reasonOpen &&
          tab === 'details'
        ) {
          event.preventDefault();
          event.stopPropagation();
          setReasonOpen(false);
          reason.current?.focus();
        }
      }}
    >
      <div className={styles.body}>
        <div className={styles.navigation}>
          <div className={styles.topRow}>
            <Text variant="meta">
              {(movedTo ?? (heads ? 'Heads-up' : 'Other mail')) +
                ' · ' +
                position +
                ' of ' +
                total}
            </Text>
            {mobile ? (
              <IconButton
                icon="close"
                aria-label="Close detail"
                data-sheet-autofocus
                onClick={onClose}
              />
            ) : (
              tabs
            )}
          </div>
          {mobile && tabs}
        </div>
        <div className={styles.identity}>
          <Text
            as="h2"
            variant="title"
            className={[styles.title, mail.title].join(' ')}
          >
            {heads ? heads.title : other!.subject}
          </Text>
          <div className={styles.person}>
            <Person
              initial={sender.charAt(0)}
              name={sender}
              role={when}
              separator=" · "
            />
            {account.minority && <AccountLabel account={account} />}
          </div>
          {movedTo && <MovedNote />}
        </div>
        {heads && (
          <>
            <div
              role="tabpanel"
              id={detailsId}
              aria-labelledby={detailsId + '-tab'}
              tabIndex={0}
              hidden={tab !== 'details'}
              className={styles.tabPanel}
            >
              <div className={styles.requestGroup}>
                <GlanceMark showLabel />
                <Text as="p" variant="request" className={mail.summary}>
                  {heads.summary}
                </Text>
              </div>
              <SourcePanel
                from={sender}
                when={when}
                source={heads.fact.source}
                kind={heads.fact.kind}
                animate={false}
                onOpenEmail={openEmail}
              />
              {!movedTo && heads.judgment && (
                <div className={styles.reason}>
                  <ReasonPill
                    ref={reason}
                    label={'Why it’s here: ' + heads.judgment.label}
                    expanded={reasonOpen}
                    controls={reasonId}
                    mobile={mobile}
                    onToggle={() => setReasonOpen((value) => !value)}
                  />
                  {reasonOpen && (
                    <section
                      id={reasonId}
                      aria-label="Glance’s read"
                      className={mail.read}
                    >
                      <Text as="p" variant="meta">
                        Glance’s reasoning · not stated in the email
                      </Text>
                      <Text as="p" variant="body">
                        <strong>{heads.judgment.label + ': '}</strong>
                        {heads.judgment.read}
                      </Text>
                      <SourcePanel
                        {...heads.judgment.source}
                        source={heads.judgment.source}
                        kind="judgment"
                        animate={false}
                        onOpenEmail={openEmail}
                      />
                    </section>
                  )}
                </div>
              )}
              {heads.watch && watchlist && (
                <Text as="p" variant="meta" className={mail.watch}>
                  {watchlist.onOpen ? (
                    <>
                      Part of{' '}
                      <Button
                        variant="text"
                        size="compact"
                        onClick={watchlist.onOpen}
                      >
                        {'Watchlist: ' + watchlist.name}
                      </Button>
                    </>
                  ) : (
                    'Part of Watchlist: ' + watchlist.name
                  )}
                </Text>
              )}
            </div>
            <div
              role="tabpanel"
              id={emailId}
              aria-labelledby={emailId + '-tab'}
              tabIndex={0}
              hidden={tab !== 'email'}
              className={styles.tabPanel}
            >
              <EmailView
                item={{ email: heads.email, when }}
                account={account}
                highlighted={highlighted}
                onHighlightedChange={setHighlighted}
              />
            </div>
          </>
        )}
        {other && (
          <div className={styles.tabPanel}>
            <Text as="p" variant="body" className={mail.reason}>
              <GlanceMark /> {'Glance put this in Other mail: '}
              <strong>{other.reason}</strong>
              {other.basis && (
                <>
                  {' '}
                  <span className={mail.basis}>
                    {other.basis === 'instruction'
                      ? 'Your instruction'
                      : 'Learned'}
                  </span>
                </>
              )}
            </Text>
            <div className={mail.original}>
              <EmailBody paras={other.paras} />
            </div>
            <div
              role="note"
              className={mail.legend}
              aria-label="Highlight legend"
            >
              {kinds.has('judg') && (
                <>
                  <Highlight kind="judgment">Highlighted</Highlight> what Glance
                  used to sort it.
                </>
              )}
              {(kinds.has('money') || kinds.has('time')) && (
                <>
                  {' '}
                  {kinds.has('money') && (
                    <Highlight kind="money">Amounts</Highlight>
                  )}
                  {kinds.has('money') && kinds.has('time') && ' and '}
                  {kinds.has('time') && (
                    <Highlight kind="time">
                      {kinds.has('money') ? 'dates' : 'Dates'}
                    </Highlight>
                  )}{' '}
                  are marked too.
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.actionArea}>
        {snoozeOpen && onSnooze && (
          <div className={styles.snooze}>
            <SnoozeMenu
              id={snoozeId}
              onClose={closeSnooze}
              onChoose={(label) => {
                setSnoozeOpen(false);
                onSnooze(label);
              }}
            />
          </div>
        )}
        <footer
          ref={setActionBar}
          data-detail-actions
          className={[styles.actions, stacked && styles.stackedActions]
            .filter(Boolean)
            .join(' ')}
        >
          <Button
            className={styles.inbox}
            href={inboxUrls[account.app]}
            target="_blank"
            rel="noopener noreferrer"
            external
          >
            Open in {account.app}
          </Button>
          {(onMoveTo ||
            (currentTab === 'needs-you' && (onDone || onSnooze))) && (
            <div className={styles.secondaryActions} data-action-group>
              {currentTab === 'needs-you' && onSnooze && (
                <Button
                  ref={snoozeTrigger}
                  variant="outline"
                  size={mobile ? 'touch' : 'compact'}
                  leadingIcon="clock"
                  className={styles.snoozeTrigger}
                  aria-expanded={snoozeOpen}
                  aria-controls={snoozeId}
                  disabled={busy}
                  onClick={() => {
                    if (snoozeOpen) closeSnooze();
                    else {
                      setMoveOpen(false);
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
              {onMoveTo && (
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
              )}
              {currentTab === 'needs-you' && onDone && (
                <Button
                  variant="outline"
                  size={mobile ? 'touch' : 'compact'}
                  leadingIcon="check"
                  disabled={busy}
                  onClick={onDone}
                >
                  Done
                </Button>
              )}
            </div>
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
