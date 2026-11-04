import type { ReactNode } from 'react';
import { useTokenValues } from './tokenValues';
import styles from './Catalog.module.css';

export function FoundationPage({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.brand}>
          <span aria-hidden="true">✦</span> Glance design system
        </p>
        <h1>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>
      {children}
    </main>
  );
}

export function TokenList({
  names,
  sample,
}: {
  names: readonly string[];
  sample?: (name: string) => ReactNode;
}) {
  const values = useTokenValues(names);
  return (
    <dl className={styles.list}>
      {names.map((name) => (
        <div className={styles.row} key={name}>
          <dt>
            <code>{name}</code>
          </dt>
          <dd>
            {sample?.(name)}
            <code>{values[name]}</code>
          </dd>
        </div>
      ))}
    </dl>
  );
}
