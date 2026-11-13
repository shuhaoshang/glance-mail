import { useId, type ComponentProps } from 'react';
import { TabBar } from './TabBar';
import { HeaderButton } from '../HeaderButton/HeaderButton';
import { Text } from '../Text/Text';
import { useDesktopLayout } from '../useDesktopLayout';
import { panelItems } from './tabSamples';
import styles from './TabBar.stories.module.css';

export function TabBarExample(args: ComponentProps<typeof TabBar>) {
  const prefix = useId();
  const desktop = useDesktopLayout();
  const phone = args.mobile ?? !desktop;
  const right = args.right ?? [];
  const tabs = [...args.left, ...right];
  const identify = (tab: (typeof tabs)[number]) => ({
    ...tab,
    id: prefix + tab.id,
  });
  return (
    <div
      className={[styles.frame, phone && styles.phoneFrame]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={styles.example}>
        {phone && right.length > 0 && (
          <div
            className={styles.header}
            role="group"
            aria-label="Glance shortcuts"
          >
            {right.map((tab) => (
              <HeaderButton
                key={tab.id}
                icon={tab.id === 'watchlist' ? 'eye' : 'star'}
                label={tab.label}
                hasNews={tab.hasNews}
                selected={args.selected === tab.id}
                controls={prefix + tab.id}
                onClick={() => args.onSelect(tab.id)}
              />
            ))}
          </div>
        )}
        <TabBar
          {...args}
          left={args.left.map(identify)}
          right={right.map(identify)}
          selected={prefix + args.selected}
          onSelect={(id) => args.onSelect(id.slice(prefix.length))}
        />
        {tabs.map((tab) => (
          <section
            key={tab.id}
            id={prefix + tab.id}
            role={phone && right.includes(tab) ? 'region' : 'tabpanel'}
            aria-labelledby={
              !phone || args.left.includes(tab)
                ? prefix + tab.id + '-tab'
                : undefined
            }
            aria-label={phone && right.includes(tab) ? tab.label : undefined}
            hidden={args.selected !== tab.id}
            tabIndex={0}
            className={styles.panel}
          >
            <Text as="h2" variant="section">
              {tab.label}
            </Text>
            <ul>
              {panelItems[tab.id]?.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
