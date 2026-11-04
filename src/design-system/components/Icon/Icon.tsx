import { glyphs, type IconName } from './glyphs';
import styles from './Icon.module.css';

export type { IconName } from './glyphs';

interface IconProps {
  name: IconName;
  size?: 'small' | 'default' | 'large';
  label?: string;
  className?: string;
}

export function Icon({ name, size = 'default', label, className }: IconProps) {
  return (
    <svg
      className={[styles.icon, styles[size], className]
        .filter(Boolean)
        .join(' ')}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
    >
      {glyphs[name]}
    </svg>
  );
}
