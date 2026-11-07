import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { getPersona } from '../../data';
import { Avatar } from '../components/Avatar/Avatar';
import { BriefRow, type BriefRowItem } from '../components/BriefRow/BriefRow';
import { Button } from '../components/Button/Button';
import { CollapsedGroup } from '../components/CollapsedGroup/CollapsedGroup';
import { GlanceMark } from '../components/GlanceMark/GlanceMark';
import { Icon } from '../components/Icon/Icon';
import { KnowRow } from '../components/KnowRow/KnowRow';
import { NewMailRow } from '../components/NewMailRow/NewMailRow';
import { Notice } from '../components/Notice/Notice';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { SectionCard } from '../components/SectionCard/SectionCard';
import { Skeleton } from '../components/Skeleton/Skeleton';
import { Text } from '../components/Text/Text';
import { overloadRows } from './edgeStateSamples';
import styles from './EdgeStates.stories.module.css';

const sarah = getPersona('sarah');
const daniel = getPersona('daniel');
const gmailRows = sarah.items.filter((item) => item.account === 'gmail');
const personalKnow = daniel.goodToKnow.filter(
  (item) => item.account === 'personal',
);
const newsletters = 'Newsletters, promotions and CC’d';
const notifyConfirmation = 'Glance will notify you when it’s ready.';
const waitingWork =
  '12 work emails arrived after 7:00 PM. They’ll be in tomorrow’s brief at 8:00 AM.';

type Actions = {
  onNotify: () => void;
  onAdd: () => void;
  onReconnect: () => void;
  onShowWork: () => void;
  onOpen: (label: string) => void;
  onSelect: (itemId: string) => void;
  onOpenEmail: () => void;
};

const meta = {
  title: 'Patterns/Edge states',
  parameters: { layout: 'fullscreen' },
  args: {
    onNotify: fn(),
    onAdd: fn(),
    onReconnect: fn(),
    onShowWork: fn(),
    onOpen: fn(),
    onSelect: fn(),
    onOpenEmail: fn(),
  },
} satisfies Meta<Actions>;
export default meta;
type Story = StoryObj<Actions>;

function briefHeader(
  persona: typeof sarah,
  greeting: string,
  coverage: string,
  note?: ReactNode,
  date: string | null = persona.date,
) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <Text variant="section" className={styles.wordmark}>
          <GlanceMark /> glance
        </Text>
        <Avatar initial={persona.initial} label={persona.name} />
      </div>
      <div className={styles.greeting}>
        {date && <Text variant="meta">{date}</Text>}
        <Text as="h1" variant="display">
          {greeting}
        </Text>
        <Text as="p" variant="body" className={styles.coverage}>
          {coverage}
        </Text>
        {note && (
          <Text as="p" variant="meta" className={styles.note}>
            {note}
          </Text>
        )}
      </div>
    </header>
  );
}

function sarahRows(
  rows: readonly (BriefRowItem & { account: string })[],
  onSelect: Actions['onSelect'],
  revealedFrom = rows.length,
) {
  return rows.map((item, index) => (
    <BriefRow
      key={item.id}
      item={item}
      rank={index + 1}
      account={sarah.accounts.find(
        (account) => account.id === item.account && account.minority,
      )}
      entering={index >= revealedFrom}
      onSelect={(itemId) => onSelect(itemId)}
    />
  ));
}

function summaryRow(
  count: number,
  summary: string,
  onOpen: Actions['onOpen'],
  label: 'good to know' | 'set aside' = 'set aside',
) {
  return (
    <CollapsedGroup
      label={label}
      groups={[{ count, short: label }]}
      summary={summary}
      onSelect={() => onOpen(label)}
    />
  );
}

export const FirstBrief: Story = {
  render: function FirstBriefStory({ onNotify }) {
    const [requested, setRequested] = useState(false);
    return (
      <main className={styles.page}>
        {briefHeader(
          sarah,
          'Building your first brief',
          'Glance is reading the last 7 days. After today, each brief covers what arrived overnight.',
          undefined,
          null,
        )}
        <section
          className={styles.readingCard}
          aria-label="First brief progress"
        >
          {sarah.accounts.map((account) => (
            <div key={account.id} className={styles.readingRow}>
              <span className={styles.readingIcon}>
                <span className={styles.check}>
                  <Icon name="check" size="small" />
                </span>
              </span>
              <div className={styles.readingCopy}>
                <Text variant="body" className={styles.semibold}>
                  {account.app}
                </Text>
                <Text variant="meta">{account.label} · connected</Text>
              </div>
            </div>
          ))}
          <div className={styles.readingRow}>
            <span className={styles.readingIcon} aria-hidden="true">
              <span className={styles.readingRing} />
            </span>
            <div className={styles.readingCopy}>
              <Text variant="body" className={styles.semibold}>
                Reading your email
              </Text>
              <Text variant="meta" role="status">
                312 of 480 emails · about a minute left
              </Text>
              <div className={styles.progress}>
                <ProgressBar value={312 / 480} />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.preview} aria-label="Needs you preview">
          <Text as="h2" variant="meta" className={styles.previewLabel}>
            Needs you, coming up
          </Text>
          <div className={styles.skeletonCard}>
            {[0, 1].map((index) => (
              <div key={index} className={styles.skeletonRow}>
                <Skeleton className={styles.skeletonRank} />
                <div className={styles.skeletonCopy}>
                  <Skeleton className={styles.skeletonTitle} />
                  <Skeleton className={styles.skeletonRequest} />
                  <div className={styles.skeletonChips}>
                    <Skeleton className={styles.skeletonChip} />
                    <Skeleton className={styles.skeletonChip} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className={styles.firstFooter}>
          {requested ? (
            <Text
              as="p"
              variant="meta"
              role="status"
              className={styles.confirmation}
            >
              <Icon name="check" /> {notifyConfirmation}
            </Text>
          ) : (
            <Button
              onClick={() => {
                onNotify();
                setRequested(true);
              }}
            >
              Notify me when it’s ready
            </Button>
          )}
          <Text as="p" variant="meta" className={styles.readOnly}>
            <Icon name="lock" /> Read-only. Glance never sends or deletes email.
          </Text>
        </div>
      </main>
    );
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Building your first brief' }),
    ).toBeVisible();
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '312 of 480 emails',
    );
    await expect(
      canvas.getByText('Read-only. Glance never sends or deletes email.'),
    ).toBeVisible();
  },
};

export const NewMail: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Sarah’s pending mail stays visible and Add to brief records onAdd. See [Maya’s Set aside flow](?path=/story/patterns-set-aside--maya-flow) for the full add and ranking behavior.',
      },
    },
  },
  render: ({ onAdd, onSelect, onOpenEmail }) => (
    <main className={styles.page}>
      {briefHeader(
        sarah,
        sarah.greeting,
        sarah.coverage.text.replace('{n}', String(sarah.coverage.emails)),
        'Updated 7:40 AM',
      )}
      <SectionCard
        title="Needs you"
        count={sarah.items.length}
        rightSlot={<Text variant="meta">Most urgent first</Text>}
      >
        <NewMailRow label="2 new since 7:12 AM" onAdd={onAdd} />
        {sarahRows(sarah.items, onSelect)}
      </SectionCard>
      <SectionCard title="Good to know" count={sarah.goodToKnow.length}>
        {sarah.goodToKnow.map((item) => (
          <KnowRow key={item.title} item={item} onOpenEmail={onOpenEmail} />
        ))}
      </SectionCard>
    </main>
  ),
  play: async ({ canvas, args }) => {
    const list = within(canvas.getByRole('list', { name: 'Needs you' }));
    const before = list.getAllByRole('listitem');
    await expect(before[0]).toHaveTextContent('2 new since 7:12 AM');
    await userEvent.click(list.getByRole('button', { name: 'Add to brief' }));
    await expect(args.onAdd).toHaveBeenCalledOnce();
    await expect(list.getAllByRole('listitem')).toEqual(before);
    await expect(canvas.getByText('Updated 7:40 AM')).toBeVisible();
  },
};

export const Disconnected: Story = {
  render: ({ onReconnect, onSelect, onOpen }) => (
    <main className={styles.page}>
      {briefHeader(
        sarah,
        sarah.greeting,
        '11 emails overnight from 1 of your 2 inboxes.',
      )}
      <Notice
        icon="link-off"
        title="Yahoo Mail (Family) is disconnected"
        body="This brief only covers Gmail. School and family emails since 6:00 PM yesterday aren’t in it."
        action={{ label: 'Reconnect Yahoo Mail', onClick: onReconnect }}
      />
      <SectionCard
        title="Needs you"
        count={gmailRows.length}
        rightSlot={<Text variant="meta">From Gmail only</Text>}
      >
        {sarahRows(gmailRows, onSelect)}
      </SectionCard>
      {summaryRow(8, newsletters, onOpen)}
    </main>
  ),
  play: async ({ canvas, args }) => {
    const coverage = canvas.getByText(
      '11 emails overnight from 1 of your 2 inboxes.',
    );
    const warning = canvas.getByRole('region', {
      name: 'Yahoo Mail (Family) is disconnected',
    });
    const needs = within(canvas.getByRole('region', { name: 'Needs you 2' }));
    await expect(coverage).toBeVisible();
    await expect(needs.getByText('From Gmail only')).toBeVisible();
    await expect(needs.getAllByRole('listitem')).toHaveLength(2);
    await expect(
      canvas.queryByText('Lincoln Elementary'),
    ).not.toBeInTheDocument();
    await userEvent.click(
      within(warning).getByRole('button', { name: 'Reconnect Yahoo Mail' }),
    );
    await expect(args.onReconnect).toHaveBeenCalledOnce();
    await expect(warning).toBeVisible();
    await expect(coverage).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: /8 set aside/ }));
    await expect(args.onOpen).toHaveBeenCalledWith('set aside');
  },
};

const previewCount = 4;

export const Overload: Story = {
  render: function OverloadStory({ onOpen, onSelect }) {
    const [expanded, setExpanded] = useState(false);
    const page = useRef<HTMLElement>(null);
    useEffect(() => {
      if (expanded) {
        const rows =
          page.current?.querySelectorAll<HTMLButtonElement>(
            '[data-brief-item]',
          );
        rows?.[previewCount]?.focus();
      }
    }, [expanded]);
    const visible = expanded
      ? overloadRows
      : overloadRows.slice(0, previewCount);
    return (
      <main className={styles.page} ref={page}>
        {briefHeader(
          sarah,
          'Welcome back, Sarah',
          '236 emails from 2 inboxes since Nov 7.',
          undefined,
          'Monday, November 16',
        )}
        <SectionCard
          title="Needs you"
          count={overloadRows.length}
          rightSlot={
            expanded ? undefined : <Text variant="meta">Top 4 shown</Text>
          }
        >
          {sarahRows(visible, onSelect, previewCount)}
          {!expanded && (
            <div role="listitem">
              <Button
                variant="text"
                size="touch"
                trailingIcon="chevron"
                className={styles.showMore}
                onClick={() => setExpanded(true)}
              >
                <span className={styles.showMoreCopy}>
                  <span>Show 8 more</span>
                  <Text variant="meta">
                    Ranked the same way, most urgent first
                  </Text>
                </span>
              </Button>
            </div>
          )}
        </SectionCard>
        {summaryRow(
          14,
          'Schedule changes, deliveries and receipts',
          onOpen,
          'good to know',
        )}
        {summaryRow(210, newsletters, onOpen)}
      </main>
    );
  },
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Welcome back, Sarah' }),
    ).toBeVisible();
    await expect(
      canvas.getByText('236 emails from 2 inboxes since Nov 7.'),
    ).toBeVisible();
    const needs = within(canvas.getByRole('region', { name: 'Needs you 12' }));
    await expect(needs.getByText('Top 4 shown')).toBeVisible();
    const rows = needs.getAllByRole('listitem');
    await expect(rows).toHaveLength(5);
    await expect(rows[0]).toHaveTextContent('City Water');
    await expect(rows[0]).toHaveTextContent('Overdue 4 days');
    await expect(rows[4]).toHaveTextContent(
      'Ranked the same way, most urgent first',
    );
    await userEvent.click(within(rows[0]).getByRole('button'));
    await expect(args.onSelect).toHaveBeenCalledWith('overdue-water');
  },
};

export const QuietHours: Story = {
  render: ({ onShowWork, onOpenEmail, onOpen }) => (
    <main className={styles.page}>
      {briefHeader(
        daniel,
        'Good evening, Daniel',
        'Personal inbox only.',
        <>
          <Icon name="moon" /> Quiet hours until 8:00 AM
        </>,
      )}
      <section className={styles.quietCard} aria-labelledby="quiet-hours-title">
        <span className={styles.moon}>
          <Icon name="moon" size="large" />
        </span>
        <Text as="h2" variant="section" id="quiet-hours-title">
          Nothing personal needs you tonight
        </Text>
        <Text as="p" variant="meta" className={styles.coverage}>
          {waitingWork}
        </Text>
        <Button
          variant="text"
          size="touch"
          className={styles.showWork}
          onClick={onShowWork}
        >
          Show work email anyway
        </Button>
      </section>
      <SectionCard title="Good to know" count={personalKnow.length}>
        {personalKnow.map((item) => (
          <KnowRow key={item.title} item={item} onOpenEmail={onOpenEmail} />
        ))}
      </SectionCard>
      {summaryRow(3, 'Newsletters and promotions', onOpen)}
    </main>
  ),
  play: async ({ canvas, args }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Good evening, Daniel' }),
    ).toBeVisible();
    await expect(canvas.getByText('Quiet hours until 8:00 AM')).toBeVisible();
    await expect(
      canvas.getByRole('heading', {
        name: 'Nothing personal needs you tonight',
      }),
    ).toBeVisible();
    await expect(canvas.getByText(waitingWork)).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', { name: 'Show work email anyway' }),
    );
    await expect(args.onShowWork).toHaveBeenCalledOnce();
    await expect(canvas.getByText('Personal inbox only.')).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Good to know 1' }),
    ).toBeVisible();
    await expect(canvas.getByText('Car service')).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: /3 set aside/ }),
    ).toBeVisible();
    for (const name of [
      ...daniel.items.map((item) => item.name),
      ...daniel.goodToKnow
        .filter((item) => item.account !== 'personal')
        .map((item) => item.title),
    ]) {
      await expect(canvas.queryByText(name)).not.toBeInTheDocument();
    }
  },
};
