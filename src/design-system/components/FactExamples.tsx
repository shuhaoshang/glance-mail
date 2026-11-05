import { useId, useRef, useState } from 'react';
import type { ComponentProps } from 'react';
import type { FactSample } from './factSamples';
import { Button } from './Button/Button';
import { Field } from './Field/Field';
import { Highlight } from './Highlight/Highlight';
import { SourcePanel } from './SourcePanel/SourcePanel';
import { Text } from './Text/Text';
import styles from './FactExamples.module.css';

export function FieldExample({
  sample,
  initiallyOpen = false,
  replay = false,
  size = 'default',
}: {
  sample: FactSample;
  initiallyOpen?: boolean;
  replay?: boolean;
  size?: ComponentProps<typeof Field>['size'];
}) {
  const [open, setOpen] = useState(initiallyOpen);
  const [playback, setPlayback] = useState(0);
  const [email, setEmail] = useState(false);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div className={styles.example}>
      <Field
        ref={trigger}
        {...sample.field}
        fact={sample.fact.id}
        kind={sample.fact.kind}
        size={size}
        selected={open}
        sourcePanelId={panelId}
        onSelect={() => {
          setOpen((value) => !value);
          setPlayback((value) => value + 1);
        }}
      />
      {replay && (
        <Button
          variant="neutral"
          size="compact"
          onClick={() => {
            setOpen(true);
            setPlayback((value) => value + 1);
          }}
        >
          Replay source reveal
        </Button>
      )}
      {open && (
        <SourcePanel
          key={playback}
          id={panelId}
          from={sample.item.from}
          when={sample.item.when}
          source={sample.fact.source}
          kind={sample.fact.kind}
          onOpenEmail={() => setEmail(true)}
          onClose={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
        />
      )}
      {email && (
        <section className={styles.email} aria-label="Original email example">
          <Text variant="section" as="h3">
            {sample.item.email.subject}
          </Text>
          <Text variant="meta">{sample.item.email.from}</Text>
          {sample.item.email.paras.map((paragraph, index) => (
            <Text variant="reading" as="p" key={index}>
              {paragraph.map((segment, i) =>
                typeof segment === 'string' ? (
                  segment
                ) : (
                  <Highlight
                    key={i}
                    kind={segment.kind === 'judg' ? 'judgment' : segment.kind}
                    wrap
                  >
                    {segment.t}
                  </Highlight>
                ),
              )}
            </Text>
          ))}
          <Button variant="text" size="compact" onClick={() => setEmail(false)}>
            Close email example
          </Button>
        </section>
      )}
    </div>
  );
}

export function FieldStatesExample({ sample }: { sample: FactSample }) {
  return (
    <div className={styles.columns}>
      {['Default', 'Hover', 'Focus', 'Pressed', 'Selected'].map((state) => (
        <div key={state} className={styles.specimen} data-field-state={state}>
          <h3>{state === 'Focus' ? 'Keyboard focus' : state}</h3>
          <FieldExample sample={sample} initiallyOpen={state === 'Selected'} />
        </div>
      ))}
    </div>
  );
}
