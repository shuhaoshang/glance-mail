import { useState, type ComponentProps } from 'react';
import { InlineForm } from './InlineForm';
import { Button } from '../Button/Button';
import styles from '../feedbackExamples.module.css';
export function InlineFormExample(args: ComponentProps<typeof InlineForm>) {
  const value = args.value;
  const [open, setOpen] = useState(true),
    [trigger, setTrigger] = useState<HTMLButtonElement | null>(null),
    [result, setResult] = useState('');
  return (
    <div className={styles.example}>
      <div className={styles.controls}>
        <Button
          variant="outline"
          ref={setTrigger}
          onClick={() => setOpen(true)}
        >
          Open form
        </Button>
      </div>
      <div className={styles.panel}>
        {open && (
          <InlineForm
            {...args}
            value={value}
            onValueChange={(v) => {
              args.onValueChange(v);
            }}
            onSubmit={(v) => {
              args.onSubmit(v);
              setResult('Submitted: ' + v);
              setOpen(false);
              trigger?.focus();
            }}
            onCancel={() => {
              args.onCancel();
              setResult('Canceled');
              setOpen(false);
              trigger?.focus();
            }}
          />
        )}
        <p role="status" className={styles.result}>
          {result}
        </p>
      </div>
    </div>
  );
}
