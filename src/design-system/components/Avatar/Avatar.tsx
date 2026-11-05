import styles from './Avatar.module.css';

interface AvatarProps {
  initial: string;
  /** Supply a name when the avatar stands alone. */
  label?: string;
  size?: 'default' | 'small';
}

export function Avatar({ initial, label, size = 'default' }: AvatarProps) {
  return (
    <span
      className={[styles.avatar, size === 'small' && styles.small]
        .filter(Boolean)
        .join(' ')}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {initial}
    </span>
  );
}
