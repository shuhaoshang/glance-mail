import type { Account, Item, Segment } from '../../../data/types';
import { Text } from '../Text/Text';
import { Switch } from '../Switch/Switch';
import { Highlight } from '../Highlight/Highlight';
import { useDesktopLayout } from '../useDesktopLayout';
import styles from './EmailView.module.css';

interface EmailViewProps {
  item: Pick<Item, 'email' | 'when'>;
  account?: Account;
  highlighted: boolean;
  onHighlightedChange: (highlighted: boolean) => void;
}

const legend = [
  { kind: 'money', label: 'Money' },
  { kind: 'time', label: 'Time' },
  { kind: 'people', label: 'People' },
  { kind: 'judgment', label: 'Glance’s read' },
] as const;

export function EmailView({
  item,
  account,
  highlighted,
  onHighlightedChange,
}: EmailViewProps) {
  const desktop = useDesktopLayout();
  const usedKinds = new Set(
    item.email.paras.flatMap((paragraph) =>
      paragraph.flatMap((segment) =>
        typeof segment === 'string'
          ? []
          : [segment.kind === 'judg' ? 'judgment' : segment.kind],
      ),
    ),
  );
  const visibleLegend = legend.filter((entry) => usedKinds.has(entry.kind));
  const accountName = account
    ? desktop
      ? account.app + (account.label ? ', ' + account.label : '')
      : (account.label ?? account.app)
    : undefined;
  const metadata =
    (desktop
      ? 'From ' + item.email.from + ' · to you · '
      : item.email.from + ' · ') +
    item.when +
    (accountName ? ' · ' + accountName : '');

  return (
    <section
      aria-label="Original email"
      className={[
        styles.email,
        !desktop && styles.compact,
        highlighted && styles.enabled,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className={styles.header}>
        <Text as="h2" variant="title" className={styles.subject}>
          {item.email.subject}
        </Text>
        <Text as="p" variant="meta">
          {metadata}
        </Text>
      </header>
      <div className={styles.tools}>
        <ul aria-label="Highlight legend" className={styles.legend}>
          {visibleLegend.map((entry) => (
            <li key={entry.kind}>
              <span
                aria-hidden="true"
                className={[styles.swatch, styles[entry.kind]].join(' ')}
              />
              {entry.label}
            </li>
          ))}
        </ul>
        <div className={styles.toggle}>
          <Switch
            label="Highlighter"
            checked={highlighted}
            onCheckedChange={onHighlightedChange}
          />
        </div>
      </div>
      <EmailBody paras={item.email.paras} highlighted={highlighted} />
      {desktop && (
        <Text as="p" variant="meta">
          Highlights mark every fact Glance used in your brief. Point at one to
          see what it was used for.
        </Text>
      )}
    </section>
  );
}

export function EmailBody({
  paras,
  highlighted = true,
}: {
  paras: Segment[][];
  highlighted?: boolean;
}) {
  return (
    <div className={highlighted ? styles.enabled : undefined}>
      <div className={styles.body} data-testid="email-body">
        {paras.map((paragraph, index) => (
          <Text as="p" variant="reading" key={index}>
            {paragraph.map((segment, segmentIndex) =>
              typeof segment === 'string' ? (
                segment
              ) : (
                <span
                  key={segmentIndex}
                  title={segment.tag}
                  className={styles.segment}
                >
                  <Highlight
                    kind={segment.kind === 'judg' ? 'judgment' : segment.kind}
                    wrap
                  >
                    {segment.t}
                  </Highlight>
                  <span className={styles.srOnly}>
                    {', ' +
                      (segment.kind === 'judg' ? 'judgment' : segment.kind)}
                  </span>
                </span>
              ),
            )}
          </Text>
        ))}
      </div>
    </div>
  );
}
