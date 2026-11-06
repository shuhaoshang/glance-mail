import type { Account, Item } from '../../../data/types';
import { Text } from '../Text/Text';
import { Person } from '../Person/Person';
import { AccountLabel } from '../AccountLabel/AccountLabel';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import styles from './DetailPanel.module.css';

interface DetailPanelProps {
  item: Item;
  position: number;
  total: number;
  account?: Account;
}

export function DetailPanel({
  item,
  position,
  total,
  account,
}: DetailPanelProps) {
  return (
    <section aria-label="Selected item" className={styles.panel}>
      <div className={styles.topRow}>
        <Text variant="meta" className={styles.meta}>
          {'Needs you · ' + position + ' of ' + total}
        </Text>
      </div>
      <div className={styles.identity}>
        <Text as="h2" variant="title" className={styles.title}>
          {item.name}
        </Text>
        <div className={styles.person}>
          <Person {...item.person} />
          {account && <AccountLabel account={account} />}
        </div>
      </div>
      <div className={styles.requestGroup}>
        {item.request.type === 'summary' ? (
          <GlanceMark showLabel />
        ) : (
          <Text variant="meta" className={styles.meta}>
            {item.request.by}
          </Text>
        )}
        <Text as="p" variant="request" className={styles.request}>
          {item.request.text}
        </Text>
      </div>
    </section>
  );
}
