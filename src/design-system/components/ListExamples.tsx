import { useState } from 'react';
import type { PersonaId } from '../../data/types';
import { getPersona } from '../../data';
import { FoundationPage } from '../foundations/catalog';
import { SectionCard } from './SectionCard/SectionCard';
import { BriefRow } from './BriefRow/BriefRow';
import { KnowRow } from './KnowRow/KnowRow';
import { DoneRow } from './DoneRow/DoneRow';
import { NewMailRow } from './NewMailRow/NewMailRow';
import { CollapsedGroup } from './CollapsedGroup/CollapsedGroup';
import { Button } from './Button/Button';
import { maya } from './listSamples';
import styles from './ListExamples.module.css';

export function ListOverview({ personaId }: { personaId: PersonaId }) {
  const persona = getPersona(personaId);
  const items = persona.items.filter((item) => !item.isNew);
  const [selected, setSelected] = useState(items[0]?.id);
  const [action, setAction] = useState('');
  return (
    <FoundationPage
      title="List composites"
      description="Select rows and trace facts. These component examples use the supplied persona data."
    >
      <output className={styles.readout} aria-live="polite">
        {action || 'Choose a control to see its action.'}
      </output>
      <div className={styles.columns}>
        <div className={styles.stack}>
          <SectionCard
            title="Needs you"
            count={items.length}
            rightSlot="Most urgent first"
          >
            {persona.newMail && (
              <NewMailRow
                label={persona.newMail.label}
                onAdd={() => setAction('Add to brief requested')}
              />
            )}
            {items.map((item, index) => (
              <BriefRow
                key={item.id}
                item={item}
                rank={index + 1}
                account={persona.accounts.find(
                  (account) => account.id === item.account,
                )}
                selected={selected === item.id}
                onSelect={(id) => {
                  setSelected(id);
                  setAction('Selected: ' + item.name);
                }}
              />
            ))}
            {persona.doneBefore.map((done) => (
              <DoneRow key={done.name} {...done} />
            ))}
          </SectionCard>
          <CollapsedGroup
            groups={persona.setAside}
            selected={selected === 'set-aside'}
            onSelect={() => {
              setSelected('set-aside');
              setAction('Selected: Set aside');
            }}
          />
        </div>
        <SectionCard title="Good to know" count={persona.goodToKnow.length}>
          {persona.goodToKnow.map((item) => (
            <KnowRow
              key={item.title}
              item={item}
              account={persona.accounts.find(
                (account) => account.id === item.account,
              )}
              onOpenEmail={(source) =>
                setAction('Open email requested: ' + source.from)
              }
            />
          ))}
        </SectionCard>
      </div>
    </FoundationPage>
  );
}

export function CollapseExample() {
  const [leaving, setLeaving] = useState(false);
  const [present, setPresent] = useState(true);
  const [action, setAction] = useState('');
  return (
    <div className={styles.page}>
      <output className={styles.readout}>{action}</output>
      <div className={styles.controls}>
        <Button
          variant="neutral"
          size="compact"
          onClick={() => setLeaving(true)}
        >
          Collapse row
        </Button>
        <Button
          variant="neutral"
          size="compact"
          onClick={() => {
            setLeaving(false);
            setPresent(true);
          }}
        >
          Replay row
        </Button>
      </div>
      <SectionCard title="Needs you" count={present ? 1 : 0}>
        {present && (
          <BriefRow
            item={maya.items[0]}
            rank={1}
            leaving={leaving}
            onSelect={() => setAction('Selected: ' + maya.items[0].name)}
            onLeaveComplete={() => setPresent(false)}
          />
        )}
      </SectionCard>
    </div>
  );
}
