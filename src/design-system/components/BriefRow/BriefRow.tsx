import type { Item, Account, Fact } from '../../../data/types';
import { FactChip } from '../FactChip/FactChip';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { Badge } from '../Badge/Badge';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import { Icon } from '../Icon/Icon';
import { useDesktopLayout } from '../useDesktopLayout';
import control from '../Control.module.css';
import row from '../ListRow.module.css';
import motion from '../ListMotion.module.css';
import styles from './BriefRow.module.css';

export type BriefRowItem = Pick<Item, 'id' | 'name' | 'isNew'> & {
  request: Pick<Item['request'], 'type' | 'text'>;
  facts: readonly Pick<Fact, 'id' | 'kind' | 'label' | 'urgent'>[];
};

interface BriefRowProps {
  item: BriefRowItem;
  rank: number;
  account?: Account;
  selected?: boolean;
  entering?: boolean;
  leaving?: boolean;
  onSelect?: (itemId: string, trigger: HTMLButtonElement) => void;
  onLeaveComplete?: () => void;
}
export function BriefRow({
  item,
  rank,
  account,
  selected = false,
  entering = false,
  leaving = false,
  onSelect,
  onLeaveComplete,
}: BriefRowProps) {
  const desktop = useDesktopLayout();
  // Keep the supplied first two facts; order only that pair by urgency.
  const facts = item.facts
    .slice(0, 2)
    .map((fact, index) => ({ fact, index }))
    .sort(
      (a, b) =>
        Number(b.fact.urgent) - Number(a.fact.urgent) || a.index - b.index,
    );
  const content = (
    <>
      <span className={row.rank}>{rank}</span>
      <span className={row.content}>
        <span className={row.heading}>
          <span className={row.name}>{item.name}</span>
          {account && <AccountLabel account={account} />}
          {item.isNew && <Badge />}
        </span>
        <span className={row.request}>
          {item.request.type === 'summary' && (
            <>
              <GlanceMark />{' '}
            </>
          )}
          {item.request.text}
        </span>
        <span className={row.facts}>
          {facts.map(({ fact }) => (
            <FactChip key={fact.id} {...fact} />
          ))}
        </span>
      </span>
    </>
  );

  return (
    <div
      role="listitem"
      inert={leaving}
      className={[
        motion.shell,
        !desktop && styles.phone,
        (item.isNew || entering) && motion.enter,
        leaving && motion.leaving,
      ]
        .filter(Boolean)
        .join(' ')}
      onAnimationEnd={(event) => {
        if (leaving && event.target === event.currentTarget)
          onLeaveComplete?.();
      }}
    >
      <div className={motion.content}>
        {onSelect ? (
          <button
            type="button"
            data-brief-item={item.id}
            aria-pressed={selected}
            onClick={(event) => onSelect(item.id, event.currentTarget)}
            className={[control.control, row.button, selected && row.selected]
              .filter(Boolean)
              .join(' ')}
          >
            {content}
            {!desktop && <Icon name="chevron" className={row.chevron} />}
          </button>
        ) : (
          <div className={row.button}>{content}</div>
        )}
      </div>
    </div>
  );
}
