import { useId, useRef, useState, type ReactNode } from 'react';
import type { PersonaId } from '../data';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import type { DemoLevel } from './DemoApp';
import styles from './DemoBar.module.css';

interface DemoBarProps {
  personaId: PersonaId;
  level: DemoLevel;
  onPersonaChange: (id: PersonaId) => void;
  onLevelChange: (level: DemoLevel) => void;
  extraControls?: ReactNode;
}
const personas = [
  { id: 'maya', label: 'Maya · Sales' },
  { id: 'daniel', label: 'Daniel · Manager' },
  { id: 'sarah', label: 'Sarah · Parent' },
] as const;
const levels = [
  { value: 1, label: 'Plain AI text' },
  { value: 2, label: 'Formatted' },
  { value: 3, label: 'Glance' },
] as const;

export function DemoBar({
  personaId,
  level,
  onPersonaChange,
  onLevelChange,
  extraControls,
}: DemoBarProps) {
  const desktop = useDesktopLayout();
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <aside
      aria-label="Demo controls"
      className={[styles.shell, desktop && styles.desktop]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={styles.bar}
        onKeyDown={(event) => {
          if (!desktop && expanded && event.key === 'Escape') {
            event.preventDefault();
            setExpanded(false);
            trigger.current?.focus();
          }
        }}
      >
        {!desktop && (
          <button
            ref={trigger}
            type="button"
            className={[styles.choice, styles.trigger].join(' ')}
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded((value) => !value)}
          >
            Demo
          </button>
        )}
        {(desktop || expanded) && (
          <div id={id} className={styles.content}>
            <div className={styles.caption}>
              <strong>Demo controls</strong>
              <span>Not part of the product</span>
            </div>
            <div
              role="group"
              aria-label="Demo persona"
              className={styles.group}
            >
              {personas.map((persona) => (
                <button
                  key={persona.id}
                  type="button"
                  aria-pressed={personaId === persona.id}
                  className={styles.choice}
                  onClick={() => onPersonaChange(persona.id)}
                >
                  {persona.label}
                </button>
              ))}
            </div>
            <div role="group" aria-label="Demo level" className={styles.group}>
              {levels.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-pressed={level === item.value}
                  className={styles.choice}
                  onClick={() => onLevelChange(item.value)}
                >
                  <span className={styles.number}>{item.value}</span>
                  {' ' + item.label}
                </button>
              ))}
            </div>
            {extraControls && (
              <div className={styles.extra}>{extraControls}</div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
