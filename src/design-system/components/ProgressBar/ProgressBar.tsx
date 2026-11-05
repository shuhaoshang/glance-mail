import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
}
export function ProgressBar({ value }: ProgressBarProps) {
  const bounded = Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.fill}
        style={{ inlineSize: bounded * 100 + '%' }}
      />
    </div>
  );
}
