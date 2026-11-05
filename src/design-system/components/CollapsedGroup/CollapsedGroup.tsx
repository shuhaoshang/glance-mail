import type { SetAsideGroup } from '../../../data/types';
import { Icon } from '../Icon/Icon';
import control from '../Control.module.css';
import row from '../ListRow.module.css';
import styles from './CollapsedGroup.module.css';

interface CollapsedGroupProps {
  groups: readonly Pick<SetAsideGroup, 'count' | 'short'>[];
  selected?: boolean;
  onSelect: () => void;
}
export function CollapsedGroup({
  groups,
  selected = false,
  onSelect,
}: CollapsedGroupProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        control.control,
        row.button,
        styles.card,
        selected && row.selected,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={row.content}>
        <span className={row.name}>
          {groups.reduce((sum, group) => sum + group.count, 0)} set aside
        </span>
        <span className={styles.breakdown}>
          {groups.map((group) => group.count + ' ' + group.short).join(' · ')}
        </span>
      </span>
      <Icon name="chevron" className={row.chevron} />
    </button>
  );
}
