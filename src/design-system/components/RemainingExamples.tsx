import { useId, useRef, useState } from 'react';
import { Checkbox } from './Checkbox/Checkbox';
import { Switch } from './Switch/Switch';
import { Field } from './Field/Field';
import { SourcePanel } from './SourcePanel/SourcePanel';
import { Button } from './Button/Button';
import { Text } from './Text/Text';
import { ProgressBar } from './ProgressBar/ProgressBar';
import {
  school,
  schoolFee,
  schoolFeeValue,
  schoolSteps,
  remainingMaya,
  progressTotal,
} from './remainingSamples';
import styles from './RemainingExamples.module.css';

export function ChecklistExample({
  initiallyComplete = false,
}: {
  initiallyComplete?: boolean;
}) {
  const [checked, setChecked] = useState(() =>
    schoolSteps.map(() => initiallyComplete),
  );
  const [sourceOpen, setSourceOpen] = useState(false);
  const [email, setEmail] = useState(false);
  const sourceId = useId();
  const fieldRef = useRef<HTMLButtonElement>(null);
  const completed = checked.every(Boolean);
  return (
    <div className={styles.stack}>
      {schoolSteps.map((step, index) => (
        <Checkbox
          key={step.pre}
          checked={checked[index]}
          completed={completed}
          onCheckedChange={(value) =>
            setChecked((current) =>
              current.map((item, i) => (i === index ? value : item)),
            )
          }
          aria-label={step.pre + (step.value ?? '')}
          label={
            <>
              {step.pre}
              {step.value && (
                <Field
                  ref={fieldRef}
                  value={schoolFeeValue}
                  fact={schoolFee.id}
                  kind={schoolFee.kind}
                  inline
                  selected={sourceOpen}
                  sourcePanelId={sourceId}
                  onSelect={() => setSourceOpen((open) => !open)}
                />
              )}
            </>
          }
        />
      ))}
      {sourceOpen && (
        <SourcePanel
          id={sourceId}
          from={school.from}
          when={school.when}
          source={schoolFee.source}
          kind={schoolFee.kind}
          onClose={() => {
            setSourceOpen(false);
            fieldRef.current?.focus();
          }}
          onOpenEmail={() => setEmail(true)}
        />
      )}
      {email && (
        <section aria-label="Email excerpt">
          <Text as="p" variant="reading">
            {schoolFee.source.pre + schoolFee.source.hl + schoolFee.source.post}
          </Text>
          <Button variant="text" size="compact" onClick={() => setEmail(false)}>
            Close excerpt
          </Button>
        </section>
      )}
    </div>
  );
}
export function SwitchExample() {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      label="Highlighter"
      checked={checked}
      onCheckedChange={setChecked}
    />
  );
}
export function ProgressExample() {
  const [done, setDone] = useState(remainingMaya.doneBefore.length);
  return (
    <div className={styles.stack}>
      <div className={styles.progress}>
        <Text
          as="p"
          variant="meta"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {done + ' of ' + progressTotal + ' done'}
        </Text>
        <ProgressBar value={done / progressTotal} />
      </div>
      <div className={styles.row}>
        <Button
          variant="outline"
          disabled={done === progressTotal}
          onClick={() => setDone((value) => Math.min(progressTotal, value + 1))}
        >
          Advance example
        </Button>
        <Button
          variant="outline"
          onClick={() => setDone(remainingMaya.doneBefore.length)}
        >
          Reset example
        </Button>
      </div>
    </div>
  );
}

export function OutlineActionsExample() {
  const [action, setAction] = useState('');
  return (
    <div className={styles.stack}>
      <div className={styles.row}>
        <Button variant="outline" onClick={() => setAction('Snooze')}>
          Snooze
        </Button>
        <Button
          variant="outline"
          leadingIcon="tray-arrow"
          onClick={() => setAction('Move to Set aside')}
        >
          Move to Set aside
        </Button>
      </div>
      <output aria-live="polite">
        <Text variant="meta">
          {action ? 'Requested: ' + action : 'Choose an example action.'}
        </Text>
      </output>
    </div>
  );
}
