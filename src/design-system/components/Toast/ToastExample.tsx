import { useCallback, useState } from 'react';
import { ToastProvider } from './ToastProvider';
import { useToast } from './toastContext';
import { toastSamples, type ToastSample } from './toastSamples';
import { Button } from '../Button/Button';
import { DetailSheet } from '../DetailSheet/DetailSheet';
import { IconButton } from '../IconButton/IconButton';
import { Text } from '../Text/Text';
import { getPersona } from '../../../data';
import styles from '../feedbackExamples.module.css';
function Controls({ onUndo }: { onUndo: () => void }) {
  const { showToast } = useToast();
  return (
    <div className={styles.controls}>
      <Button
        variant="outline"
        onClick={() => showToast({ ...toastSamples.move, onUndo })}
      >
        Show move confirmation
      </Button>
      <Button variant="outline" onClick={() => showToast(toastSamples.saved)}>
        Show saved confirmation
      </Button>
      <Button
        variant="outline"
        onClick={() => showToast({ ...toastSamples.watchlist, onUndo })}
      >
        Show watchlist confirmation
      </Button>
    </div>
  );
}
function SheetControls({ onUndo }: { onUndo: () => void }) {
  const { showToast } = useToast();
  return (
    <Button onClick={() => showToast({ ...toastSamples.move, onUndo })}>
      Show confirmation
    </Button>
  );
}
export function ToastExample({
  kind = 'move',
  withUndo = true,
  initiallyVisible = true,
  sheet = false,
  onUndo,
}: {
  kind?: ToastSample;
  withUndo?: boolean;
  initiallyVisible?: boolean;
  sheet?: boolean;
  onUndo: () => void;
}) {
  const [undos, setUndos] = useState(0),
    [open, setOpen] = useState(false),
    [expanded, setExpanded] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null),
    [bar, setBar] = useState<HTMLElement | null>(null),
    [opener, setOpener] = useState<HTMLButtonElement | null>(null);
  const capture = useCallback(
    (node: HTMLDivElement | null) =>
      setContainer(node?.closest('dialog') ?? null),
    [],
  );
  const undo = () => {
    onUndo();
    setUndos((count) => count + 1);
  };
  const item = getPersona('maya').items[0];
  return (
    <ToastProvider
      initialToast={
        initiallyVisible
          ? { ...toastSamples[kind], onUndo: withUndo ? undo : undefined }
          : undefined
      }
      container={open ? container : null}
      actionBar={open ? bar : null}
    >
      <div className={styles.example}>
        <Text as="h2" variant="title">
          Confirmation examples
        </Text>
        <Controls onUndo={undo} />
        <p className={styles.result}>Undo calls: {undos}</p>
        {sheet && (
          <>
            <Button ref={setOpener} onClick={() => setOpen(true)}>
              Open detail sheet
            </Button>
            <DetailSheet
              open={open}
              onClose={() => setOpen(false)}
              returnFocus={opener}
              label={item.name}
            >
              <div className={styles.sheet} ref={capture}>
                <div className={styles.sheetBody}>
                  <div className={styles.sheetHeader}>
                    <Text as="h2" variant="title">
                      {item.name}
                    </Text>
                    <IconButton
                      icon="close"
                      aria-label="Close detail"
                      data-sheet-autofocus
                      onClick={() => setOpen(false)}
                    />
                  </div>
                  <Text as="p" variant="request">
                    {item.request.text}
                  </Text>
                  <Text as="p" variant="reading">
                    {item.facts[1].source.pre +
                      item.facts[1].source.hl +
                      item.facts[1].source.post}
                  </Text>
                  <Button
                    variant="outline"
                    onClick={() => setExpanded((value) => !value)}
                  >
                    Toggle action bar size
                  </Button>
                </div>
                <div className={styles.actions} ref={setBar}>
                  {expanded && (
                    <Text as="p" variant="body">
                      An additional action row changes the available space.
                    </Text>
                  )}
                  <SheetControls onUndo={undo} />
                </div>
              </div>
            </DetailSheet>
          </>
        )}
      </div>
    </ToastProvider>
  );
}
