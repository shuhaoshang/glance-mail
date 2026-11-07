import type { ButtonHTMLAttributes } from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './IconButton.module.css';

interface IconButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  icon: IconName;
  'aria-label': string;
  size?: 'default' | 'compact';
}

export function IconButton({
  icon,
  size = 'default',
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={[
        control.control,
        hitTarget.target,
        styles.button,
        size === 'compact' && styles.compact,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Icon name={icon} />
    </button>
  );
}
