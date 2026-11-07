import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
  Ref,
} from 'react';
import { Icon, type IconName } from '../Icon/Icon';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './Button.module.css';

interface Appearance {
  children: ReactNode;
  variant?: 'primary' | 'tint' | 'neutral' | 'outline' | 'text';
  size?: 'default' | 'touch' | 'compact';
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  disabled?: boolean;
}

type ButtonProps = Appearance &
  (
    | (ButtonHTMLAttributes<HTMLButtonElement> & {
        ref?: Ref<HTMLButtonElement>;
        href?: never;
        external?: never;
      })
    | (AnchorHTMLAttributes<HTMLAnchorElement> & {
        ref?: Ref<HTMLAnchorElement>;
        href: string;
        external?: boolean;
      })
  );

export function Button({
  children,
  variant = 'primary',
  size,
  leadingIcon,
  trailingIcon,
  external,
  className,
  ...props
}: ButtonProps) {
  const resolvedSize = size ?? (variant === 'outline' ? 'compact' : 'default');
  const classes = [
    control.control,
    resolvedSize === 'compact' && hitTarget.target,
    styles.button,
    styles[variant],
    resolvedSize !== 'default' && styles[resolvedSize],
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
