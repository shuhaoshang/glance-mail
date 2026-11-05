import { useId, type ComponentProps } from 'react';
import { samples } from './detailExampleData';
import { SegmentedControl } from './SegmentedControl';
import styles from './Example.module.css';

export function DetailTabsExample(
  props: ComponentProps<typeof SegmentedControl>,
) {
  const prefix = useId();
  const options = props.options.map((option) => ({
    ...option,
    panelId: prefix + option.panelId,
  }));
  return (
    <div className={styles.example}>
      <SegmentedControl {...props} options={options} />
      {options.map((option) => (
        <div
          key={option.value}
          role="tabpanel"
          id={option.panelId}
          aria-labelledby={option.panelId + '-tab'}
          hidden={option.value !== props.value}
          tabIndex={0}
          className={styles.panel}
        >
          {samples[option.value] ?? option.label}
        </div>
      ))}
    </div>
  );
}
