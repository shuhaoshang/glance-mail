import { useRef } from 'react';
import type { Item, SetAsideGroup } from '../../../data/types';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Icon } from '../Icon/Icon';
import { Badge } from '../Badge/Badge';
import { GlanceMark } from '../GlanceMark/GlanceMark';
import { Text } from '../Text/Text';
import motion from '../ListMotion.module.css';
import styles from './SetAsideList.module.css';

export type AsideGroup = Omit<SetAsideGroup, 'rows'> & {
  rows: SetAsideGroup['rows'];
};
interface Props {
  groups: AsideGroup[];
  moved: Item[];
  kept: Record<string, boolean>;
  apps: string[];
  onKeep: (id: string) => void;
  onUndoKeep: (id: string) => void;
  onRestore: (id: string) => void;
  onBack: () => void;
  onClose?: () => void;
  mobile?: boolean;
  busy?: boolean;
}
export function SetAsideList({
  groups,
  moved,
  kept,
  apps,
  onKeep,
  onUndoKeep,
  onRestore,
  onBack,
  onClose,
  mobile = false,
  busy,
}: Props) {
  const root = useRef<HTMLElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const total = groups.reduce((n, g) => n + g.count, 0) + moved.length;
  return (
    <section
      ref={root}
      aria-label="Set aside view"
      className={[styles.panel, mobile && styles.mobile]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.header}>
        {!mobile && (
          <div className={styles.navigation}>
            <Button
              ref={back}
              variant="text"
              size="compact"
              className={styles.action}
              onClick={onBack}
            >
              <Icon name="chevron" className={styles.backIcon} />
              Back to brief
            </Button>
          </div>
        )}
        <header className={styles.intro}>
          <div className={styles.navigation}>
            <Text as="h2" variant="title" className={styles.title}>
              Set aside <span>{total}</span>
            </Text>
            {mobile && (
              <IconButton
                icon="close"
                aria-label="Close Set aside"
                data-sheet-autofocus
                onClick={onClose ?? onBack}
              />
            )}
          </div>
          <Text as="p" variant="body" className={styles.description}>
            <GlanceMark /> Glance set these aside because none of them asks
            anything of you. Nothing is deleted; they all stay in{' '}
            {apps.join(' and ')}.
          </Text>
        </header>
      </div>
      {moved.length > 0 && (
        <section aria-label="Moved by you" className={styles.group}>
          <Text as="h3" variant="body" className={styles.groupTitle}>
            Moved by you <span>{moved.length}</span>
          </Text>
          <ul className={styles.rows}>
            {moved.map((item) => (
              <li key={item.id} className={styles.row}>
                <div className={styles.content}>
                  <Text variant="meta" className={styles.name}>
                    {item.name}
                  </Text>
                  <Text as="p" variant="meta" className={styles.request}>
                    {item.request.type === 'summary' && (
                      <>
                        <GlanceMark />{' '}
                      </>
                    )}
                    {item.request.text}
                  </Text>
                </div>
                <Button
                  variant="text"
                  size="touch"
                  className={styles.action}
                  aria-label={'Back to Needs you: ' + item.name}
                  disabled={busy}
                  onClick={() => {
                    onRestore(item.id);
                    requestAnimationFrame(() =>
                      (
                        back.current ??
                        root.current?.querySelector<HTMLElement>(
                          '[data-sheet-autofocus]',
                        )
                      )?.focus(),
                    );
                  }}
                >
                  Back to Needs you
                </Button>
              </li>
            ))}
          </ul>
        </section>
      )}
      {groups.map((group) => {
        const more =
          group.count - group.rows.filter((row) => !kept[row.id]).length;
        return (
          <section
            key={group.title}
            aria-label={group.title}
            className={styles.group}
          >
            <Text as="h3" variant="body" className={styles.groupTitle}>
              {group.title} <span>{group.count}</span>
            </Text>
            <ul className={styles.rows}>
              {group.rows.map((row) => (
                <li key={row.id} className={styles.row}>
                  <div className={styles.content}>
                    <span className={styles.heading}>
                      <Text variant="meta" className={styles.name}>
                        {row.title}
                      </Text>
                      {row.isNew && <Badge />}
                    </span>
                    <Text as="p" variant="meta" className={styles.subject}>
                      {row.sub}
                    </Text>
                  </div>
                  <div className={styles.actions}>
                    {kept[row.id] && (
                      <span className={[styles.kept, motion.enter].join(' ')}>
                        <Icon name="check" />
                        In Good to know
                      </span>
                    )}
                    <Button
                      variant="text"
                      size="touch"
                      className={styles.action}
                      aria-label={
                        (kept[row.id]
                          ? 'Undo Show in brief: '
                          : 'Show in brief: ') + row.title
                      }
                      onClick={() =>
                        kept[row.id] ? onUndoKeep(row.id) : onKeep(row.id)
                      }
                    >
                      {kept[row.id] ? 'Undo' : 'Show in brief'}
                    </Button>
                  </div>
                </li>
              ))}
              {more > 0 && (
                <li className={styles.more}>{'+' + more + ' more'}</li>
              )}
            </ul>
          </section>
        );
      })}
      <Text as="p" variant="meta">
        “Show in brief” moves the email to Good to know, and “Move to Set aside”
        in Glance’s read does the opposite. Both teach Glance for next time.
      </Text>
    </section>
  );
}
