import { useId, useState } from 'react';
import { MoveMenu, type Destination } from './MoveMenu';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';
import { DetailSheet } from '../DetailSheet/DetailSheet';
import { IconButton } from '../IconButton/IconButton';
import { getPersona } from '../../../data';
import styles from '../feedbackExamples.module.css';
export function MoveMenuExample({
  current,
  onChoose,
  sheet = false,
}: {
  current: Destination;
  onChoose: (id: Destination) => void;
  sheet?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [opener, setOpener] = useState<HTMLButtonElement | null>(null);
  const [bar, setBar] = useState<HTMLDivElement | null>(null);
  const [result, setResult] = useState('');
  const item = getPersona('maya').items[0];
  const content = (
    <div className={styles.sheet}>
      <div className={styles.sheetBody}>
        <div className={styles.sheetHeader}>
          <Text as="h2" variant="title">
            {item.name}
          </Text>
          {sheet && (
            <IconButton
              icon="close"
              aria-label="Close detail"
              data-sheet-autofocus
              onClick={() => setSheetOpen(false)}
            />
          )}
        </div>
        <Text as="p" variant="request">
          {item.request.text}
        </Text>
        <Text as="p" variant="meta">
          Select outside the menu to close it.
        </Text>
        <p className={styles.result} role="status">
          {result}
        </p>
      </div>
      <div className={styles.actions} ref={setBar}>
        <Button
          ref={setTrigger}
          variant="outline"
          size={sheet ? 'touch' : 'compact'}
          leadingIcon="move"
          trailingIcon="chevron-down"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={id}
          className={styles.menuTrigger}
          onClick={() => setOpen((value) => !value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          Move to
        </Button>
        <MoveMenu
          id={id}
          open={open}
          current={current}
          trigger={trigger}
          actionBar={bar}
          onClose={() => setOpen(false)}
          onChoose={(destination) => {
            onChoose(destination);
            setResult('Selected destination: ' + destination);
          }}
        />
      </div>
    </div>
  );
  return (
    <div className={styles.example}>
      {sheet ? (
        <>
          <Button ref={setOpener} onClick={() => setSheetOpen(true)}>
            Open detail sheet
          </Button>
          <DetailSheet
            open={sheetOpen}
            label={item.name}
            onClose={() => setSheetOpen(false)}
            returnFocus={opener}
          >
            {content}
          </DetailSheet>
        </>
      ) : (
        <div className={styles.panel}>{content}</div>
      )}
    </div>
  );
}
