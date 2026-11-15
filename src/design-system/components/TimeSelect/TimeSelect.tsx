import { Icon } from '../Icon/Icon';
import control from '../Control.module.css';
import styles from './TimeSelect.module.css';

interface TimeSelectProps {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  prefix?: string;
}

export function TimeSelect({
  label,
  value,
  options,
  onChange,
  prefix = '',
}: TimeSelectProps) {
  return (
    <span className={styles.wrap}>
      <select
        aria-label={label}
        value={value}
        className={[control.control, styles.select].join(' ')}
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((time) => (
          <option key={time} value={time}>
            {prefix}
            {time}
          </option>
        ))}
      </select>
      <Icon name="chevron-down" className={styles.chevron} />
    </span>
  );
}
