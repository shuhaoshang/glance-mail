import { useId } from 'react';
import { Button } from '../Button/Button';
import { Icon, type IconName } from '../Icon/Icon';
import { Text } from '../Text/Text';
import styles from './Notice.module.css';

interface NoticeProps {
  icon: IconName;
  title: string;
  body: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Notice({ icon, title, body, action }: NoticeProps) {
  const titleId = useId();

  return (
    <section className={styles.notice} aria-labelledby={titleId}>
      <div className={styles.content}>
        <span className={styles.tile}>
          <Icon name={icon} />
        </span>
        <div className={styles.copy}>
          <Text as="h2" variant="body" id={titleId} className={styles.title}>
            {title}
          </Text>
          <Text as="p" variant="meta" className={styles.body}>
            {body}
          </Text>
        </div>
      </div>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </section>
  );
}
