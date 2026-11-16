import { keepDatesTogether } from '../keepDatesTogether';
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import type { Persona } from '../../../data/types';
import {
  themeOptions,
  type ThemeControl,
  type ThemePreference,
} from '../AccountMenu/themeOptions';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Person } from '../Person/Person';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { Switch } from '../Switch/Switch';
import { TimeSelect } from '../TimeSelect/TimeSelect';
import { useDesktopLayout } from '../useDesktopLayout';
import snooze from '../SnoozeMenu/SnoozeMenu.module.css';
import { privacyNote, type SettingsPreferences } from './preferences';
import styles from './SettingsPanel.module.css';

const sections = [
  { id: 'inboxes', label: 'Inboxes' },
  { id: 'brief', label: 'Brief' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'quiet-hours', label: 'Quiet hours' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'account', label: 'Account' },
] as const;
type Section = (typeof sections)[number]['id'];
export interface SettingsEntry {
  section?: 'inboxes';
}

interface Props {
  persona: Persona;
  preferences: SettingsPreferences;
  onPreferencesChange: (preferences: SettingsPreferences) => void;
  theme: ThemeControl;
  entry: SettingsEntry;
  onBack: () => void;
  onLogout: () => void;
}

const notifications = [
  { key: 'briefReady', label: 'Brief is ready' },
  { key: 'watchlistChanges', label: 'Something on your Watchlist changes' },
  { key: 'dueToday', label: 'A Needs you item is due today' },
] as const;

export function SettingsPanel({
  persona,
  preferences,
  onPreferencesChange,
  theme,
  entry,
  onBack,
  onLogout,
}: Props) {
  const desktop = useDesktopLayout();
  const prefix = useId();
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const ok = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<Section>('inboxes');
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const headingId = (id: Section) => prefix + '-' + id;
  const workAccount = persona.accounts.find(
    (account) => account.label === 'Work',
  );
  const quietHoursInbox = workAccount?.label
    ? 'your ' + workAccount.label + ' inbox'
    : persona.accounts[0].app;
  const { name, initial, email } = persona;

  useLayoutEffect(() => {
    if (entry.section) {
      const target = root.current?.ownerDocument.getElementById(
        prefix + '-' + entry.section,
      );
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ block: 'start' });
    } else {
      title.current?.focus();
    }
  }, [entry, prefix]);

  useLayoutEffect(() => {
    if (confirmation) ok.current?.focus();
  }, [confirmation]);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: Section) {
    event.preventDefault();
    const target = root.current?.ownerDocument.getElementById(headingId(id));
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'start' });
  }

  function update<K extends keyof SettingsPreferences>(
    key: K,
    value: SettingsPreferences[K],
  ) {
    onPreferencesChange({ ...preferences, [key]: value });
  }

  function openConfirmation(id: string, trigger: HTMLButtonElement) {
    opener.current = trigger;
    setConfirmation(id);
  }

  function closeConfirmation() {
    setConfirmation(null);
    opener.current?.focus({ preventScroll: true });
  }

  function confirmationFor(id: string) {
    if (confirmation !== id) return null;
    return (
      <div
        className={[snooze.panel, styles.confirmation].join(' ')}
        onKeyDown={(event) => {
          if (event.key === 'Escape') closeConfirmation();
        }}
      >
        <p role="status">This is a demo. Nothing was changed.</p>
        <Button
          ref={ok}
          variant="outline"
          size="compact"
          onClick={closeConfirmation}
        >
          OK
        </Button>
      </div>
    );
  }

  function section(id: Section, label: string, children: ReactNode) {
    return (
      <section className={styles.panel} aria-labelledby={headingId(id)}>
        <h2 id={headingId(id)} tabIndex={-1} onFocus={() => setActive(id)}>
          {label}
        </h2>
        {children}
      </section>
    );
  }

  return (
    <section
      ref={root}
      className={[styles.page, desktop && styles.desktop]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={prefix + '-settings'}
    >
      <Button
        variant="text"
        size="touch"
        className={styles.back}
        onClick={onBack}
        aria-label="Back to brief"
      >
        ‹ Back to brief
      </Button>
      <h1 id={prefix + '-settings'} ref={title} tabIndex={-1}>
        Settings
      </h1>
      <div className={styles.layout}>
        {desktop && (
          <nav aria-label="Settings sections" className={styles.navigation}>
            {sections.map(({ id, label }) => (
              <a
                key={id}
                href={'#' + headingId(id)}
                aria-current={active === id ? 'location' : undefined}
                onClick={(event) => navigate(event, id)}
              >
                {label}
              </a>
            ))}
          </nav>
        )}
        <div className={styles.sections}>
          {section(
            'inboxes',
            'Inboxes',
            <>
              <ul className={styles.inboxes}>
                {persona.accounts.map((account) => (
                  <li key={account.id}>
                    <div className={styles.row}>
                      <div className={styles.identity}>
                        <span className={styles.tile}>
                          <Icon name="inbox" />
                        </span>
                        <div className={styles.copy}>
                          <strong>{account.app}</strong>
                          <p className={styles.meta}>
                            {account.label ??
                              (persona.accounts.length === 1 ? (
                                <span className={styles.inboxAddress}>
                                  {email}
                                </span>
                              ) : (
                                account.app
                              ))}{' '}
                            {keepDatesTogether('· connected Oct 28')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="compact"
                        aria-label={
                          'Disconnect ' +
                          account.app +
                          (account.label ? ' ' + account.label : '')
                        }
                        onClick={(event) =>
                          openConfirmation(account.id, event.currentTarget)
                        }
                      >
                        Disconnect
                      </Button>
                    </div>
                    {confirmationFor(account.id)}
                  </li>
                ))}
              </ul>
              <div className={styles.row}>
                <div className={styles.identity}>
                  <span className={[styles.tile, styles.neutral].join(' ')}>
                    <Icon name="plus" />
                  </span>
                  <div className={styles.copy}>
                    <strong>Connect another inbox</strong>
                    <p className={styles.meta}>Gmail, Outlook or Yahoo Mail</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="compact"
                  onClick={(event) =>
                    openConfirmation('connect', event.currentTarget)
                  }
                >
                  Connect
                </Button>
              </div>
              {confirmationFor('connect')}
              <p className={styles.privacy}>{privacyNote}</p>
            </>,
          )}
          {section(
            'brief',
            'Brief',
            <div className={styles.row}>
              <div className={styles.copy}>
                <strong>Morning brief</strong>
                <p className={styles.meta}>
                  Each brief covers the email since your last one.
                </p>
              </div>
              <TimeSelect
                label="Morning brief"
                value={preferences.morning}
                options={['7:00 AM', '7:30 AM', '8:00 AM']}
                onChange={(value) => update('morning', value)}
              />
            </div>,
          )}
          {section(
            'notifications',
            'Notifications',
            notifications.map(({ key, label }) => (
              <div className={styles.row} key={key}>
                <strong>{label}</strong>
                <Switch
                  label={label}
                  hideLabel
                  checked={preferences[key]}
                  onCheckedChange={(checked) => update(key, checked)}
                />
              </div>
            )),
          )}
          {section(
            'quiet-hours',
            'Quiet hours',
            <>
              <div className={styles.row}>
                <div className={styles.copy}>
                  <strong>Hold work email in the evening</strong>
                  <p className={styles.meta}>
                    Nothing from {quietHoursInbox} reaches you between these
                    times.
                  </p>
                </div>
                <Switch
                  label="Hold work email in the evening"
                  hideLabel
                  checked={preferences.quietHours}
                  onCheckedChange={(checked) => update('quietHours', checked)}
                />
              </div>
              <div className={styles.times}>
                <TimeSelect
                  label="From"
                  prefix="From "
                  value={preferences.from}
                  options={['6:00 PM', '7:00 PM', '8:00 PM']}
                  onChange={(value) => update('from', value)}
                />
                <TimeSelect
                  label="Until"
                  prefix="Until "
                  value={preferences.until}
                  options={['6:00 AM', '7:00 AM', '8:00 AM']}
                  onChange={(value) => update('until', value)}
                />
              </div>
            </>,
          )}
          {section(
            'appearance',
            'Appearance',
            <div className={[styles.row, styles.appearance].join(' ')}>
              <strong>Theme</strong>
              <SegmentedControl
                aria-label="Theme"
                mode="radio"
                options={themeOptions}
                fullWidth={!desktop}
                value={theme.value}
                onValueChange={(value) =>
                  theme.onChange(value as ThemePreference)
                }
              />
            </div>,
          )}
          {section(
            'account',
            'Account',
            <>
              <div className={[styles.row, styles.accountIdentity].join(' ')}>
                <Person
                  variant="identity"
                  initial={initial}
                  name={name}
                  role={email}
                />
                <Button
                  variant="outline"
                  size="compact"
                  leadingIcon="log-out"
                  onClick={onLogout}
                >
                  Log out
                </Button>
              </div>
              <div className={styles.row}>
                <div className={styles.copy}>
                  <strong>Delete Glance data</strong>
                  <p className={styles.meta}>
                    Removes your Memory: what you told Glance and what it
                    learned. Your inbox isn’t touched.
                  </p>
                </div>
                <Button
                  variant="text"
                  size="compact"
                  className={styles.delete}
                  onClick={(event) =>
                    openConfirmation('delete', event.currentTarget)
                  }
                >
                  Delete
                </Button>
              </div>
              {confirmationFor('delete')}
            </>,
          )}
        </div>
      </div>
    </section>
  );
}
