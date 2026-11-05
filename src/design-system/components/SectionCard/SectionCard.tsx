import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { Text } from '../Text/Text';
import { useDesktopLayout } from '../useDesktopLayout';
import { SectionDisclosure } from './disclosure';
import styles from './SectionCard.module.css';

interface SectionCardProps {
  title: string;
  count: number;
  rightSlot?: ReactNode;
  children: ReactNode;
}
export function SectionCard({
  title,
  count,
  rightSlot,
  children,
}: SectionCardProps) {
  const id = useId();
  const desktop = useDesktopLayout();
  const [active, setActive] = useState<string | null>(null);
  return (
    <section aria-labelledby={id} className={styles.section}>
      <header className={styles.header}>
        <Text as="h2" variant="section" id={id}>
          {title} <span className={styles.count}>{count}</span>
        </Text>
        {rightSlot && <div className={styles.right}>{rightSlot}</div>}
      </header>
      <SectionDisclosure.Provider
        value={{
          active,
          toggle: (key) =>
            setActive((current) => (current === key ? null : key)),
          close: () => setActive(null),
        }}
      >
        <div
          role="list"
          aria-label={title}
          className={[styles.card, desktop && styles.desktop]
            .filter(Boolean)
            .join(' ')}
        >
          {children}
        </div>
      </SectionDisclosure.Provider>
    </section>
  );
}
