import type { Fact } from '../../../data/types';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import { Highlight, type HighlightKind } from '../Highlight/Highlight';
import styles from './SourcePanel.module.css';

interface SourcePanelProps {
  id?: string;
  from: string;
  when: string;
  source: Fact['source'];
  kind: HighlightKind;
  animate?: boolean;
  onOpenEmail: () => void;
  onClose?: () => void;
}

export function SourcePanel({
  id,
  from,
  when,
  source,
  kind,
  animate = true,
  onOpenEmail,
  onClose,
}: SourcePanelProps) {
  return (
    <section
      id={id}
      onKeyDown={(event) => {
        if (event.key !== 'Escape' || !onClose) return;
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      role="region"
      aria-label={'Source from ' + from}
      className={[styles.panel, animate && styles.reveal]
        .filter(Boolean)
        .join(' ')}
    >
      <header className={styles.header}>
        <Text variant="meta" className={styles.metadata}>
          {'Source · ' + from + ' · ' + when}
        </Text>
        <div className={styles.actions}>
          <Button variant="text" size="compact" onClick={onOpenEmail}>
            Open email
          </Button>
          {onClose && (
            <IconButton
              size="compact"
              icon="close"
              aria-label="Close source"
              onClick={onClose}
            />
          )}
        </div>
      </header>
      <Text as="p" variant="reading">
        {source.pre}
        <Highlight kind={kind} selected animate={animate} wrap>
          {source.hl}
        </Highlight>
        {source.post}
      </Text>
    </section>
  );
}
