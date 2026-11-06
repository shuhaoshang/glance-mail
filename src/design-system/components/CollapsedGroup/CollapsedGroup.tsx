import type { SetAsideGroup } from '../../../data/types';
import { Icon } from '../Icon/Icon';
import control from '../Control.module.css';
import row from '../ListRow.module.css';
import styles from './CollapsedGroup.module.css';

type CollapsedGroupProps = {
  groups: readonly Pick<SetAsideGroup, 'count' | 'short'>[];
} & (
  | { static: true; selected?: never; onSelect?: never }
  | { static?: false; selected?: boolean; onSelect: () => void }
);

export function CollapsedGroup(props: CollapsedGroupProps) {
  const content = (
    <span className={row.content}>
      <span className={row.name}>
        {props.groups.reduce((sum, group) => sum + group.count, 0)} set aside
      </span>
      <span className={styles.breakdown}>
        {props.groups
          .map((group) => group.count + ' ' + group.short)
          .join(' · ')}
      </span>
    </span>
  );

  if (props.static)
    return (
      <section
        aria-label="Set aside"
        className={[styles.card, styles.static].join(' ')}
      >
        {content}
      </section>
    );

  return (
    <button
      type="button"
      aria-pressed={props.selected ?? false}
      onClick={props.onSelect}
      className={[
        control.control,
        row.button,
        styles.card,
        props.selected && row.selected,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
      <Icon name="chevron" className={row.chevron} />
    </button>
  );
}
