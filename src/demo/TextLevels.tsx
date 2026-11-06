import type { Persona } from '../data';
import { Text } from '../design-system/components/Text/Text';
import { useDesktopLayout } from '../design-system/components/useDesktopLayout';
import styles from './TextLevels.module.css';

interface TextLevelsProps {
  persona: Persona;
  level: 1 | 2;
}

export function TextLevels({ persona, level }: TextLevelsProps) {
  const desktop = useDesktopLayout();
  const classes = [
    styles.panel,
    desktop && styles.desktop,
    level === 1 ? styles.plain : styles.formatted,
  ]
    .filter(Boolean)
    .join(' ');

  if (level === 1)
    return (
      <section aria-label="Brief as plain text" className={classes}>
        <Text as="h2" variant="meta" className={styles.label}>
          Your inbox summary
        </Text>
        <Text as="p" variant="reading">
          {persona.demo.levels.l1}
        </Text>
      </section>
    );

  const formatted = persona.demo.levels.l2;
  return (
    <section aria-label="Brief as formatted text" className={classes}>
      <Text as="h2" variant="title" className={styles.heading}>
        Needs you
      </Text>
      <ul className={styles.list}>
        {formatted.needs.map(([lead, text]) => (
          <li key={lead}>
            <strong>{lead}</strong>
            {text}
          </li>
        ))}
      </ul>
      <Text as="h2" variant="title" className={styles.heading}>
        Good to know
      </Text>
      <ul className={styles.list}>
        {formatted.know.map((text) => (
          <li key={text}>{text}</li>
        ))}
      </ul>
      {formatted.done.length > 0 && (
        <>
          <Text as="h2" variant="title" className={styles.heading}>
            Done
          </Text>
          <ul className={styles.list}>
            {formatted.done.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </>
      )}
      <Text as="p" variant="body" className={styles.aside}>
        {formatted.setAside}
      </Text>
    </section>
  );
}
