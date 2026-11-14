import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import styles from './AllDone.module.css';
export function AllDone({
  done,
  total,
  know,
  aside,
  snoozed = 0,
  wording = 'legacy',
  onReviewAside,
}: {
  done: number;
  total: number;
  know: number;
  aside: number;
  snoozed?: number;
  wording?: 'legacy' | 'tabs';
  onReviewAside?: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <section aria-label="All done" className={styles.panel}>
      <span className={styles.icon} aria-hidden="true">
        <Icon name="check" />
      </span>
      <Text as="h2" variant="title" className={styles.title}>
        {snoozed > 0
          ? 'Nothing else needs you right now'
          : 'Nothing else needs you today'}
      </Text>
      <Text as="p" variant="body" className={styles.text}>
        {done +
          ' of ' +
          total +
          ' actions done.' +
          (snoozed
            ? ' ' +
              snoozed +
              ' snoozed item' +
              (snoozed === 1 ? '' : 's') +
              ' will come back later.'
            : '') +
          ' ' +
          (wording === 'tabs'
            ? know + ' emails in Heads-up and ' + aside + ' in Other mail.'
            : know +
              ' things are good to know, and ' +
              aside +
              ' emails are set aside.')}
      </Text>
      {wording === 'legacy' && onReviewAside && (
        <Button
          data-review-set-aside
          variant="tint"
          onClick={(event) => onReviewAside(event.currentTarget)}
        >
          Review set aside
        </Button>
      )}
    </section>
  );
}
