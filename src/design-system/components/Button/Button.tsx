import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import control from '../Control.module.css';
import styles from './Button.module.css';

interface Appearance {
  children: ReactNode;
  variant?: 'primary' | 'tint' | 'neutral' | 'text';
  size?: 'default' | 'compact';
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
}

type ButtonProps = Appearance &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: never;
        external?: never;
      })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & {
        href: string;
        external?: boolean;
      })
  );

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  leadingIcon,
  trailingIcon,
  external,
  className,
  ...props
}: ButtonProps) {
  const classes = [
    control.control,
    styles.button,
    styles[variant],
    size === 'compact' && styles.compact,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const lastIcon = external ? 'external' : trailingIcon;
  const content = (
    <>
      {leadingIcon && <Icon name={leadingIcon} />}
      {children}
      {lastIcon && <Icon name={lastIcon} />}
    </>
  );

  if (props.href !== undefined) {
    const { href, disabled, tabIndex, onClick, ...link } = props;
    return (
      <a
        {...link}
        className={classes}
        href={disabled ? undefined : href}
        role={disabled ? 'link' : link.role}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : tabIndex}
        onClick={
          disabled
            ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              }
            : onClick
        }
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={classes}>
      {content}
    </button>
  );
}
