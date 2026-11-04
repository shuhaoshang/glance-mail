import { useSyncExternalStore, type HTMLAttributes } from 'react';
import tokenSheet from '../../tokens/tokens.css?raw';
import styles from './Text.module.css';

export type TextVariant =
  | 'display'
  | 'request'
  | 'title'
  | 'section'
  | 'body'
  | 'reading'
  | 'meta'
  | 'chip';

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant: TextVariant;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

// Use the same media condition that selects desktop layout in the token sheet.
const desktopCondition = tokenSheet
  .match(/@media\s+([^{]+)\{\s*:root\s*\{[^}]*--gutter\s*:/)?.[1]
  .trim();
if (!desktopCondition)
  throw new Error('Missing desktop layout rule in tokens.css.');

const desktop =
  typeof window === 'undefined'
    ? undefined
    : window.matchMedia(desktopCondition);

function subscribe(notify: () => void) {
  desktop?.addEventListener('change', notify);
  return () => desktop?.removeEventListener('change', notify);
}

const isDesktop = () => desktop?.matches ?? false;
const isServerDesktop = () => false;

export function Text({
  variant,
  as: Tag = 'span',
  className,
  ...props
}: TextProps) {
  const wide = useSyncExternalStore(subscribe, isDesktop, isServerDesktop);
  const classes = [
    styles.text,
    styles[variant],
    wide && styles.desktop,
    className,
  ];

  return <Tag {...props} className={classes.filter(Boolean).join(' ')} />;
}
