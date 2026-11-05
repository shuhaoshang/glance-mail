import type { Account } from '../../../data/types';
import styles from './AccountLabel.module.css';

/** Only the minority inbox needs an account label. */
export function AccountLabel({
  account,
}: {
  account: Pick<Account, 'minority' | 'label'>;
}) {
  return account.minority && account.label ? (
    <span className={styles.label}>{account.label}</span>
  ) : null;
}
