import { useId, useRef, useState } from 'react';
import type { PersonaId } from '../data';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import type { DemoLevel } from './DemoApp';
import { usePhoneLabels } from './usePhoneLabels';
import { themeOptions, type ThemeControl } from './themePreference';
import styles from './DemoBar.module.css';

interface DemoBarProps {
  personaId: PersonaId;
  level: DemoLevel;
  onPersonaChange: (id: PersonaId) => void;
  onLevelChange: (level: DemoLevel) => void;
  theme?: ThemeControl;
  simulation?: { label: string; disabled: boolean; onClick: () => void };
}
const personas = [
  { id: 'maya', label: 'Maya · Sales', shortLabel: 'Maya' },
  { id: 'daniel', label: 'Daniel · Manager', shortLabel: 'Daniel' },
  { id: 'sarah', label: 'Sarah · Parent', shortLabel: 'Sarah' },
] as const;
const levels = [
  { value: 1, label: 'Plain AI text', shortLabel: 'Plain' },
  { value: 2, label: 'Formatted', shortLabel: 'Formatted' },
  { value: 3, label: 'Glance', shortLabel: 'Glance' },
] as const;

export function DemoBar({
  personaId,
  level,
  onPersonaChange,
  onLevelChange,
  theme,
  simulation,
}: DemoBarProps) {
  const desktop = useDesktopLayout();
  const phone = usePhoneLabels();
  const [expanded, setExpanded] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <aside
      aria-label="Demo controls"
      className={[
        styles.shell,
        desktop && styles.desktop,
        phone && styles.phone,
      ]
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
            <div className={styles.controls}>
              <div
                role="group"
                aria-label="Demo persona"
                className={styles.group}
              >
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    aria-label={persona.label}
                    aria-pressed={personaId === persona.id}
                    className={styles.choice}
                    onClick={() => onPersonaChange(persona.id)}
                  >
                    {phone ? persona.shortLabel : persona.label}
                  </button>
                ))}
              </div>
              <div
                role="group"
                aria-label="Demo level"
                className={styles.group}
              >
                {levels.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-label={item.value + ' ' + item.label}
                    aria-pressed={level === item.value}
                    className={styles.choice}
                    onClick={() => onLevelChange(item.value)}
                  >
                    <span className={styles.number}>{item.value}</span>
                    {' ' + (phone ? item.shortLabel : item.label)}
                  </button>
                ))}
              </div>
              {theme && (
                <div
                  role="group"
                  aria-label="Demo theme"
                  className={styles.group}
                >
                  {themeOptions.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={theme.value === value}
                      className={styles.choice}
                      onClick={() => theme.onChange(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
              {simulation && (
                <button
                  type="button"
                  className={[styles.choice, styles.simulate].join(' ')}
                  disabled={simulation.disabled}
                  onClick={simulation.onClick}
                >
                  {simulation.label}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
