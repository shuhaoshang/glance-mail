import { useState } from 'react';
import type { Fact, FieldSpec, Item, Scene } from '../../../data/types';
import { Text } from '../Text/Text';
import { Field } from '../Field/Field';
import { FactChip } from '../FactChip/FactChip';
import { DateTile } from '../DateTile/DateTile';
import { Checkbox } from '../Checkbox/Checkbox';
import { Icon } from '../Icon/Icon';
import tones from '../factStyles.module.css';
import styles from './SceneCard.module.css';

export interface SceneFieldSelection {
  fieldKey: string;
  fact: Fact;
  trigger: HTMLButtonElement | null;
}
export type SceneCardItem = Pick<Item, 'id' | 'facts' | 'from' | 'when'> & {
  scene?: Scene | { type: string } | null;
};
interface SceneCardProps {
  item: SceneCardItem;
  mobile?: boolean;
  checkedSteps?: boolean[];
  onCheckedStepsChange?: (values: boolean[]) => void;
  selectedField?: string;
  sourcePanelId?: string;
  onSelectFact: (selection: SceneFieldSelection) => void;
  onChecklistCompleteChange?: (complete: boolean) => void;
}
const sceneTypes = [
  'deal',
  'decision',
  'approval',
  'payment',
  'mismatch',
  'event',
  'range',
  'checklist',
  'text',
];
function isKnownScene(value: SceneCardItem['scene']): value is Scene {
  // The build validates known scene payloads; unfamiliar types use the fact list.
  return !!value && sceneTypes.includes(value.type);
}

function Content({
  item,
  mobile = false,
  checkedSteps,
  onCheckedStepsChange,
  selectedField,
  sourcePanelId,
  onSelectFact,
  onChecklistCompleteChange,
}: SceneCardProps) {
  const [localChecked, setChecked] = useState<boolean[]>([]);
  const checked = checkedSteps ?? localChecked;
  const scene = isKnownScene(item.scene) ? item.scene : undefined;
  const complete =
    scene?.type === 'checklist' &&
    scene.steps.length > 0 &&
    scene.steps.every((_, i) => checked[i]);
  function field(
    spec: FieldSpec,
    fieldKey: string,
    size: 'small' | 'default' | 'large' = 'small',
    inline = false,
  ) {
    const fact = spec.fact
      ? item.facts.find((entry) => entry.id === spec.fact)
      : undefined;
    let trigger: HTMLButtonElement | null = null;
    return (
      <Field
        {...spec}
        size={size}
        inline={inline}
        {...(fact
          ? {
              fact: fact.id,
              kind: fact.kind,
              selected: selectedField === fieldKey,
              sourcePanelId,
              ref: (element: HTMLButtonElement | null) => {
                trigger = element;
              },
              onSelect: () => onSelectFact({ fieldKey, fact, trigger }),
            }
          : { fact: undefined })}
      />
    );
  }
  const slot = (
    spec: FieldSpec,
    fieldKey: string,
    size: 'small' | 'default' | 'large' = 'small',
  ) => (
    <div key={fieldKey} className={styles.fieldSlot}>
      {field(spec, fieldKey, size)}
    </div>
  );
  if (!scene || scene.type === 'text')
    return (
      <ul aria-label="Facts from the email" className={styles.fallback}>
        {item.facts.map((fact) => (
          <li key={fact.id} className={tones[fact.kind]}>
            <span aria-hidden="true" className={styles.dot} />
            <div className={styles.fieldSlot}>
              {field({ value: fact.label, fact: fact.id }, 'facts.' + fact.id)}
            </div>
          </li>
        ))}
      </ul>
    );

  const urgent = item.facts.find((fact) => fact.urgent);
  let body;
  switch (scene.type) {
    case 'deal':
      body = (
        <div className={styles.deal}>
          {scene.fields.map((spec, i) => slot(spec, 'fields.' + i, 'default'))}
        </div>
      );
      break;
    case 'decision':
      body = (
        <div
          className={[styles.options, mobile && styles.stackedOptions]
            .filter(Boolean)
            .join(' ')}
        >
          {scene.options.map((option, i) => (
            <div className={styles.option} key={option.key}>
              <div className={styles.optionHeading}>
                <Text variant="chip" className={styles.key}>
                  {option.key}
                </Text>
                <Text variant="body" className={styles.optionTitle}>
                  {option.title}
                </Text>
              </div>
              {slot({ value: option.value, fact: option.fact }, 'options.' + i)}
            </div>
          ))}
        </div>
      );
      break;
    case 'approval':
    case 'payment':
      body = (
        <>
          <div className={styles.amount}>
            {slot(scene.amount, 'amount', 'large')}
            {scene.fields.map((spec, i) => slot(spec, 'fields.' + i))}
          </div>
          {scene.type === 'approval' && scene.note && (
            <Text as="p" variant="meta">
              {scene.note}
            </Text>
          )}
        </>
      );
      break;
    case 'mismatch':
      body = (
        <div className={styles.comparison}>
          <div className={styles.compareValues}>
            {scene.compare.map((spec, i) => (
              <div className={styles.comparePart} key={i}>
                {i > 0 && (
                  <span
                    role="img"
                    aria-label="does not match"
                    className={styles.mismatch}
                  >
                    ≠
                  </span>
                )}
                {slot(spec, 'compare.' + i, 'large')}
              </div>
            ))}
          </div>
          {scene.fields.map((spec, i) => slot(spec, 'fields.' + i))}
        </div>
      );
      break;
    case 'event':
      body = (
        <div className={styles.event}>
          <DateTile date={scene.tile} />
          <div className={styles.eventMain}>
            {slot(
              { value: scene.main.value, fact: scene.main.fact },
              'main',
              'default',
            )}
            <Text variant="meta">{scene.title}</Text>
          </div>
          <div className={styles.eventInstructions}>
            {scene.fields.map((spec, i) => slot(spec, 'fields.' + i))}
          </div>
        </div>
      );
      break;
    case 'range':
      body = (
        <div className={styles.range}>
          <div className={styles.rangeTiles}>
            <DateTile date={scene.from} />
            <Icon name="arrow" className={styles.arrow} />
            <DateTile date={scene.to} />
          </div>
          <div className={styles.rangeFields}>
            {scene.fields.map((spec, i) =>
              slot(spec, 'fields.' + i, 'default'),
            )}
          </div>
        </div>
      );
      break;
    case 'checklist':
      body = (
        <>
          <div className={styles.steps}>
            {scene.steps.map((step, i) => (
              <Checkbox
                key={step.pre}
                label={
                  <>
                    {step.pre}
                    {step.value && (
                      <span className={styles.inlineFact}>
                        {field(
                          { value: step.value, fact: step.fact },
                          'steps.' + i,
                          'small',
                          true,
                        )}
                      </span>
                    )}
                  </>
                }
                aria-label={step.pre + (step.value ?? '')}
                checked={!!checked[i]}
                completed={complete}
                onCheckedChange={(value) => {
                  const next = scene.steps.map((_, index) =>
                    index === i ? value : !!checked[index],
                  );
                  setChecked(next);
                  onCheckedStepsChange?.(next);
                  onChecklistCompleteChange?.(next.every(Boolean));
                }}
              />
            ))}
          </div>
          <div className={styles.checklistFields}>
            {scene.fields.map((spec, i) => slot(spec, 'fields.' + i))}
          </div>
        </>
      );
      break;
  }
  return (
    <div className={styles.stack}>
      <section aria-label={scene.label} className={styles.card}>
        <header className={styles.header}>
          <Text variant="meta" className={styles.label}>
            {scene.label}
          </Text>
          {scene.urgent && urgent && (
            <FactChip kind={urgent.kind} label={scene.urgent} urgent />
          )}
        </header>
        {body}
      </section>
      {scene.type === 'checklist' && complete && scene.doneNote && (
        <Text as="p" variant="meta" role="status">
          {scene.doneNote}
        </Text>
      )}
    </div>
  );
}

export function SceneCard(props: SceneCardProps) {
  return <Content key={props.item.id} {...props} />;
}
