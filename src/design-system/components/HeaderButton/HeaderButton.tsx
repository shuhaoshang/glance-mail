import { Icon, type IconName } from '../Icon/Icon';
import control from '../Control.module.css';
import hitTarget from '../HitTarget.module.css';
import styles from './HeaderButton.module.css';

interface HeaderButtonProps {
  icon: IconName;
  label: string;
  selected?: boolean;
  hasNews?: boolean;
  controls?: string;
  onClick: () => void;
}

export function HeaderButton({
  icon,
  label,
  selected = false,
  hasNews = false,
  controls,
  onClick,
}: HeaderButtonProps) {
  return (
    <button
      type="button"
      aria-label={label + (hasNews ? ', new' : '')}
      aria-pressed={selected}
      aria-controls={controls}
      onClick={onClick}
      className={[control.control, hitTarget.target, styles.button].join(' ')}
    >
      <Icon name={icon} size="large" />
      {hasNews && <span className={styles.news} aria-hidden="true" />}
    </button>
  );
}
