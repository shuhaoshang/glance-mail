import { useId } from 'react';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import styles from './InlineForm.module.css';
interface InlineFormProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  submitLabel?: string;
  placeholder?: string;
  note?: string;
  autoFocus?: boolean;
}
export function InlineForm({
  label,
  value,
  onValueChange,
  onSubmit,
  onCancel,
  submitLabel = 'Add',
  placeholder,
  note,
  autoFocus,
}: InlineFormProps) {
  const noteId = useId();
  return (
    <form
      className={styles.form}
      aria-label={label}
      onSubmit={(event) => {
        event.preventDefault();
        if (value.trim()) onSubmit(value.trim());
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
          event.preventDefault();
          event.stopPropagation();
          onCancel();
        }
      }}
    >
      <div className={styles.row}>
        <TextInput
          label={label}
          hideLabel
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-describedby={note ? noteId : undefined}
        />
        <Button type="submit" size="compact" disabled={!value.trim()}>
          {submitLabel}
        </Button>
        <Button variant="outline" size="compact" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      {note && (
        <p id={noteId} className={styles.note}>
          <Icon name="star" size="small" />
          <span>{note}</span>
        </p>
      )}
    </form>
  );
}
