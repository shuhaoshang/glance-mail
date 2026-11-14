import { useId, type InputHTMLAttributes, type Ref } from 'react';
import styles from './TextInput.module.css';
export interface TextInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'aria-label'
> {
  label: string;
  hideLabel?: boolean;
  ref?: Ref<HTMLInputElement>;
}
export function TextInput({
  label,
  hideLabel = false,
  id,
  className,
  ref,
  ...props
}: TextInputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const input = (
    <input
      {...props}
      ref={ref}
      id={inputId}
      type="text"
      aria-label={hideLabel ? label : undefined}
      className={[styles.input, className].filter(Boolean).join(' ')}
    />
  );
  return hideLabel ? (
    input
  ) : (
    <label className={styles.label} htmlFor={inputId}>
      <span>{label}</span>
      {input}
    </label>
  );
}
