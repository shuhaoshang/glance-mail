import { Icon } from '../Icon/Icon';
import control from '../Control.module.css';
import row from '../ListRow.module.css';
import styles from './CollapsedGroup.module.css';

type CollapsedGroupProps = {
  label: string;
  summary?: string;
  groups: readonly { count: number; short: string }[];
} & (
  | { static: true; selected?: never; onSelect?: never }
  | {
      static?: false;
      selected?: boolean;
      onSelect: (trigger: HTMLButtonElement) => void;
    }
);

export function CollapsedGroup(props: CollapsedGroupProps) {
  const { label } = props;
  const count = props.groups.reduce((sum, group) => sum + group.count, 0);
  const card = [styles.card, props.summary !== undefined && styles.withSummary]
    .filter(Boolean)
    .join(' ');
  const content = (
    <span className={[row.content, styles.content].join(' ')}>
      <span className={[row.name, styles.name].join(' ')}>
        {count} {label}
      </span>
      <span className={styles.breakdown}>
        {props.summary ??
          props.groups
            .map((group) => group.count + ' ' + group.short)
            .join(' · ')}
      </span>
    </span>
  );

  if (props.static)
    return (
      <section
        aria-label={label.charAt(0).toUpperCase() + label.slice(1)}
        className={[card, styles.static].join(' ')}
      >
        {content}
      </section>
    );

  return (
    <button
      type="button"
      aria-pressed={props.selected ?? false}
      onClick={(event) => props.onSelect(event.currentTarget)}
      className={[
        control.control,
        row.button,
        card,
        props.selected && row.selected,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {content}
      <Icon
        name="chevron"
        className={[row.chevron, styles.chevron].join(' ')}
      />
    </button>
  );
}
