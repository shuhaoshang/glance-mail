import { useState } from 'react';
import { getPersona, type PersonaId } from '../data';
import type { Account } from '../data/types';
import { Text } from '../design-system/components/Text/Text';
import { Icon } from '../design-system/components/Icon/Icon';
import { Avatar } from '../design-system/components/Avatar/Avatar';
import { GlanceMark } from '../design-system/components/GlanceMark/GlanceMark';
import { SectionCard } from '../design-system/components/SectionCard/SectionCard';
import { BriefRow } from '../design-system/components/BriefRow/BriefRow';
import { KnowRow } from '../design-system/components/KnowRow/KnowRow';
import { DoneRow } from '../design-system/components/DoneRow/DoneRow';
import { ProgressBar } from '../design-system/components/ProgressBar/ProgressBar';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import { getBriefCounts } from './briefData';
import styles from './App.module.css';

function openInbox(account: Account) {
  const urls = {
    Gmail: 'https://mail.google.com/',
    Outlook: 'https://outlook.office.com/mail/',
    'Yahoo Mail': 'https://mail.yahoo.com/',
  };
  window.open(urls[account.app], '_blank', 'noopener,noreferrer');
}

function Brief({ personaId }: { personaId: PersonaId }) {
  const persona = getPersona(personaId);
  const items = persona.items.filter((item) => !item.isNew);
  const [selectedId, setSelectedId] = useState(
    items[persona.demo.initialSelection.itemIndex]?.id ?? items[0]?.id,
  );
  const desktop = useDesktopLayout();
  const selected = items.find((item) => item.id === selectedId);
  const counts = getBriefCounts(persona);
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
            <Text as="p" variant="meta">
              {persona.coverage.note}
            </Text>
          )}
        </div>
      </header>
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
                selected={item.id === selectedId}
                onSelect={setSelectedId}
              />
            ))}
            {persona.doneBefore.map((item) => (
              <DoneRow key={item.name} {...item} />
            ))}
          </SectionCard>
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
          <SectionCard title="Set aside" count={counts.aside}>
            <div role="listitem" className={styles.asideSummary}>
              <Text as="p" variant="meta">
                {persona.setAside
                  .map((group) => group.count + ' ' + group.short)
                  .join(' · ')}
              </Text>
            </div>
          </SectionCard>
        </div>
        {desktop && selected && (
          <section aria-label="Selected item" className={styles.detail}>
            <Text as="h2" variant="title">
              {selected.name}
            </Text>
            <Text as="p" variant="request">
              {selected.request.type === 'summary' && (
                <>
                  <GlanceMark />{' '}
                </>
              )}
              {selected.request.text}
            </Text>
          </section>
        )}
      </div>
    </main>
  );
}

export function App({ personaId }: { personaId: PersonaId }) {
  return <Brief key={personaId} personaId={personaId} />;
}
