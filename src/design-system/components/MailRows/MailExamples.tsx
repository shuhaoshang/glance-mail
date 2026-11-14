import { useState } from 'react';
import { getPersona } from '../../../data';
import { BriefRow } from '../BriefRow/BriefRow';
import { HeadsUpRow } from '../HeadsUpRow/HeadsUpRow';
import { OtherMailRow } from '../OtherMailRow/OtherMailRow';
import { MailList, OtherMailList } from '../MailList/MailList';
import { DetailPanel } from '../DetailPanel/DetailPanel';
import { DetailSheet } from '../DetailSheet/DetailSheet';
import { AllDone } from '../AllDone/AllDone';
import { DoneRow } from '../DoneRow/DoneRow';
import { useDesktopLayout } from '../useDesktopLayout';
import { movedRow, type EmailOrigin, type EmailTab } from './movedEmail';
import styles from './MailExamples.module.css';
export function MailExample({
  personaId = 'maya',
  kind = 'heads-up',
  index = 0,
  movedTo,
  initialEmail = false,
}: {
  personaId?: 'maya' | 'daniel' | 'sarah';
  kind?: EmailOrigin['kind'];
  index?: number;
  movedTo?: EmailTab;
  initialEmail?: boolean;
}) {
  const persona = getPersona(personaId),
    desktop = useDesktopLayout();
  const [selected, setSelected] = useState(index),
    [open, setOpen] = useState(false),
    [trigger, setTrigger] = useState<HTMLElement | null>(null),
    [watch, setWatch] = useState('');
  const items =
    kind === 'heads-up'
      ? persona.goodToKnow
      : kind === 'other-mail'
        ? persona.otherMail.rows.filter((row) => !row.isNew)
        : persona.items.filter((item) => !item.isNew);
  const item = items[selected];
  const choose = (id: string, element: HTMLButtonElement) => {
    setSelected(items.findIndex((item) => item.id === id));
    setTrigger(element);
    if (!desktop) setOpen(true);
  };
  const destination =
    movedTo ??
    (kind === 'heads-up'
      ? 'Heads-up'
      : kind === 'other-mail'
        ? 'Other mail'
        : 'Needs you');
  const origin: EmailOrigin =
    kind === 'heads-up'
      ? { kind, item: persona.goodToKnow[selected] }
      : kind === 'other-mail'
        ? {
            kind,
            item: persona.otherMail.rows.filter((row) => !row.isNew)[selected],
          }
        : { kind, item: persona.items.filter((item) => !item.isNew)[selected] };
  const accountId = 'account' in item ? item.account : undefined;
  const account =
    persona.accounts.find((a) => a.id === accountId) ?? persona.accounts[0];
  const watchId = 'watch' in item ? item.watch : undefined;
  const watchItem = persona.watchlist.find((entry) => entry.id === watchId);
  const common = {
    position: movedTo ? 1 : selected + 1,
    total: movedTo
      ? 1
      : kind === 'other-mail'
        ? persona.otherMail.total
        : items.length,
    account,
    movedTo,
    mobile: !desktop,
    onClose: () => setOpen(false),
    watchlist: watchItem
      ? { name: watchItem.name, onOpen: () => setWatch(watchItem.name) }
      : undefined,
  };
  const detail =
    origin.kind === 'needs-you' ? (
      <DetailPanel
        {...common}
        item={origin.item}
        initialTab={initialEmail ? 'email' : 'details'}
      />
    ) : origin.kind === 'heads-up' ? (
      <DetailPanel
        {...common}
        variant="heads-up"
        item={origin.item}
        initialTab={initialEmail ? 'email' : 'details'}
      />
    ) : (
      <DetailPanel {...common} variant="other-mail" item={origin.item} />
    );
  return (
    <div
      className={[styles.example, desktop && styles.desktop]
        .filter(Boolean)
        .join(' ')}
    >
      {movedTo ? (
        <MailList tab={destination}>
          {destination === 'Needs you' ? (
            <BriefRow
              item={movedRow(origin)}
              rank={1}
              selected={desktop}
              onSelect={(_, element) => {
                setTrigger(element);
                setOpen(true);
              }}
            />
          ) : destination === 'Heads-up' ? (
            <HeadsUpRow
              item={movedRow(origin)}
              selected={desktop}
              onSelect={(_, element) => {
                setTrigger(element);
                setOpen(true);
              }}
            />
          ) : (
            <OtherMailRow
              item={movedRow(origin)}
              selected={desktop}
              onSelect={(_, element) => {
                setTrigger(element);
                setOpen(true);
              }}
            />
          )}
        </MailList>
      ) : kind === 'other-mail' ? (
        <OtherMailList
          items={persona.otherMail.rows.filter((row) => !row.isNew)}
          total={persona.otherMail.total}
          selected={desktop || open ? item.id : undefined}
          onSelect={choose}
        />
      ) : (
        <MailList
          tab={destination}
          progress={
            kind === 'needs-you'
              ? {
                  done: persona.doneBefore.length,
                  total: items.length + persona.doneBefore.length,
                }
              : undefined
          }
        >
          {kind === 'heads-up'
            ? persona.goodToKnow.map((entry) => (
                <HeadsUpRow
                  key={entry.id}
                  item={entry}
                  selected={(desktop || open) && item.id === entry.id}
                  account={persona.accounts.find((a) => a.id === entry.account)}
                  onSelect={choose}
                />
              ))
            : persona.items
                .filter((entry) => !entry.isNew)
                .map((entry, i) => (
                  <BriefRow
                    key={entry.id}
                    item={entry}
                    rank={i + 1}
                    selected={(desktop || open) && item.id === entry.id}
                    onSelect={choose}
                  />
                ))}
          {kind === 'needs-you' &&
            persona.doneBefore.map((entry) => (
              <DoneRow key={entry.name} {...entry} />
            ))}
        </MailList>
      )}
      {desktop ? (
        detail
      ) : (
        <DetailSheet
          open={open}
          label={
            origin.kind === 'needs-you'
              ? origin.item.name
              : origin.kind === 'heads-up'
                ? origin.item.title
                : origin.item.subject
          }
          onClose={() => setOpen(false)}
          returnFocus={trigger}
        >
          {detail}
        </DetailSheet>
      )}
      {watch && <p role="status">{'Watchlist selected: ' + watch}</p>}
    </div>
  );
}
export function MovedRows() {
  const p = getPersona('maya');
  const origins: EmailOrigin[] = [
    { kind: 'needs-you', item: p.items[0] },
    { kind: 'heads-up', item: p.goodToKnow[0] },
    { kind: 'other-mail', item: p.otherMail.rows[0] },
  ];
  const [selected, setSelected] = useState('');
  return (
    <div className={styles.matrix}>
      {(['Needs you', 'Heads-up', 'Other mail'] as const).map((tab) => (
        <section key={tab}>
          <h2>{tab}</h2>
          <MailList tab={tab}>
            {origins.map((origin, index) => {
              const item = movedRow(origin);
              const props = {
                item,
                selected: selected === tab + item.id,
                onSelect: () => setSelected(tab + item.id),
              };
              return tab === 'Needs you' ? (
                <BriefRow key={item.id} {...props} rank={index + 1} />
              ) : tab === 'Heads-up' ? (
                <HeadsUpRow key={item.id} {...props} />
              ) : (
                <OtherMailRow key={item.id} {...props} />
              );
            })}
          </MailList>
        </section>
      ))}
    </div>
  );
}
export function EmptyExamples() {
  const p = getPersona('maya');
  return (
    <div className={styles.matrix}>
      <MailList tab="Heads-up" empty />
      <OtherMailList items={[]} total={0} onSelect={() => {}} />
      <MailList
        tab="Needs you"
        empty
        emptyContent={
          <AllDone
            done={4}
            total={4}
            know={p.goodToKnow.length}
            aside={p.otherMail.total}
          />
        }
      />
    </div>
  );
}
