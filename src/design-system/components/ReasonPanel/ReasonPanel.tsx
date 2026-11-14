import type { Item } from '../../../data/types';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { Highlight } from '../Highlight/Highlight';
import { ordinal } from './reasonText';
import styles from './ReasonPanel.module.css';

interface ReasonPanelProps {
  item: Item;
  position: number;
  id?: string;
  watchlist?: { name: string; onOpen?: () => void };
}

export function ReasonPanel({
  item,
  position,
  id,
  watchlist,
}: ReasonPanelProps) {
  return (
    <section id={id} aria-label="Glance’s read" className={styles.panel}>
      <Text as="p" variant="meta" className={styles.label}>
        Glance’s reasoning <span>· not stated in the email</span>
      </Text>
      <Text as="p" variant="body" className={styles.read}>
        <strong>{'Why ' + ordinal(position) + ':'}</strong>
        {' ' + item.rank}
      </Text>
      {item.judgments.map((judgment) => (
        <div key={judgment.label} className={styles.judgment}>
          <Text as="p" variant="body" className={styles.read}>
            <strong>{judgment.label + ':'}</strong>
            {' ' + judgment.why}
          </Text>
          {judgment.source && (
            <div className={styles.source}>
              <Text as="p" variant="meta">
                {'Based on · ' +
                  judgment.source.from +
                  ' · ' +
                  judgment.source.when}
              </Text>
              <Text as="p" variant="reading">
                {judgment.source.pre}
                <Highlight kind="judgment" wrap>
                  {judgment.source.hl}
                </Highlight>
                {judgment.source.post}
              </Text>
            </div>
          )}
        </div>
      ))}
      {watchlist && (
        <footer className={styles.watchlist}>
          {watchlist.onOpen ? (
            <>
              <Text variant="meta">Based on</Text>
              <Button variant="text" size="compact" onClick={watchlist.onOpen}>
                {'Watchlist: ' + watchlist.name}
              </Button>
            </>
          ) : (
            <Text variant="meta">
              {'Based on Watchlist: ' + watchlist.name}
            </Text>
          )}
        </footer>
      )}
    </section>
  );
}
