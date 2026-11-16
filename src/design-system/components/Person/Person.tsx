import type { Item } from '../../../data/types';
import { Avatar } from '../Avatar/Avatar';
import styles from './Person.module.css';

export function Person({
  initial,
  name,
  role,
  separator = ', ',
  variant = 'inline',
}: Item['person'] & {
  separator?: ', ' | ' · ';
  variant?: 'inline' | 'identity';
}) {
  if (variant === 'identity')
    return (
      <span className={[styles.person, styles.identity].join(' ')}>
        <Avatar initial={initial} />
        <span className={styles.details}>
          <strong>{name}</strong>
          <span>{role}</span>
        </span>
      </span>
    );
  return (
    <span className={styles.person}>
      <Avatar initial={initial} size="small" />
      <span>
        {name}
        {role && separator + role}
      </span>
    </span>
  );
}
