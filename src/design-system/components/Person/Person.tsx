import type { Item } from '../../../data/types';
import { Avatar } from '../Avatar/Avatar';
import styles from './Person.module.css';

export function Person({ initial, name, role }: Item['person']) {
  return (
    <span className={styles.person}>
      <Avatar initial={initial} size="small" />
      <span>
        {name}, {role}
      </span>
    </span>
  );
}
