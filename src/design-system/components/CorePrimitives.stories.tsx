import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { getPersona } from '../../data';
import { FoundationPage } from '../foundations/catalog';
import { Button } from './Button/Button';
import { IconButton } from './IconButton/IconButton';
import { AccountLabel } from './AccountLabel/AccountLabel';
import { Badge } from './Badge/Badge';
import { GlanceMark } from './GlanceMark/GlanceMark';
import { Avatar } from './Avatar/Avatar';
import { Person } from './Person/Person';
import { DetailTabsExample } from './SegmentedControl/DetailTabsExample';
import { itemViews } from './SegmentedControl/detailExampleData';
import styles from './CorePrimitives.stories.module.css';

const meta = {
  title: 'Primitives/Core primitives',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;

function Gallery() {
  const maya = getPersona('maya');
  const [lastAction, setAction] = useState('');
  const [view, setView] = useState('details');
  return (
    <FoundationPage
      title="Core primitives"
      description="Try the buttons and move between item views using the arrow keys."
    >
      <div className={styles.sheet}>
        <section className={styles.group}>
          <h2>Buttons</h2>
          <div className={styles.row}>
            <Button onClick={() => setAction('Open in Gmail')}>
              Open in Gmail
            </Button>
            <Button variant="tint" onClick={() => setAction('Ask')}>
              Ask
            </Button>
            <Button variant="neutral" onClick={() => setAction('Done')}>
              Done
            </Button>
            <Button
              variant="text"
              size="compact"
              onClick={() => setAction('Undo')}
            >
              Undo
            </Button>
            <IconButton
              icon="close"
              aria-label="Close source"
              onClick={() => setAction('Close source')}
            />
          </div>
          <output className={styles.feedback}>
            {lastAction
              ? 'Last action: ' + lastAction
              : 'Select a control to see its action.'}
          </output>
        </section>
        <section className={styles.group}>
          <h2>Labels and people</h2>
          <div className={styles.row}>
            <AccountLabel account={getPersona('sarah').accounts[1]} />
            <Badge />
            <GlanceMark showLabel />
          </div>
          <div className={styles.row}>
            <Person {...maya.items[0].person} />
            <Avatar label={maya.name} initial={maya.initial} />
          </div>
        </section>
        <section className={styles.group}>
          <h2>Segmented control</h2>
          <DetailTabsExample
            aria-label="Item views"
            options={itemViews}
            value={view}
            onValueChange={setView}
          />
        </section>
      </div>
    </FoundationPage>
  );
}

export const Overview: StoryObj<typeof meta> = { render: () => <Gallery /> };

const states = ['Default', 'Hover', 'Focus', 'Pressed', 'Disabled'] as const;

const stateButtons = [
  { variant: 'primary', label: 'Open in Gmail' },
  { variant: 'tint', label: 'Ask' },
  { variant: 'neutral', label: 'Done' },
  { variant: 'text', label: 'Undo' },
] as const;

function InteractionStates() {
  const [action, setAction] = useState('');
  return (
    <FoundationPage
      title="Interaction states"
      description="Compare the same controls across five states. Use Tab to try keyboard focus."
    >
      <div className={styles.states}>
        {states.map((state) => (
          <section key={state} className={styles.state}>
            <h2>{state}</h2>
            {stateButtons.map(({ variant, label }) => (
              <Button
                key={variant}
                data-specimen={state}
                variant={variant}
                disabled={state === 'Disabled'}
                onClick={() => setAction(state + ' ' + label)}
              >
                {label}
              </Button>
            ))}
            <IconButton
              data-specimen={state}
              icon="close"
              aria-label="Close source"
              disabled={state === 'Disabled'}
              onClick={() => setAction(state + ' Close source')}
            />
          </section>
        ))}
      </div>
      <output className={styles.feedback}>
        {action ? 'Last action: ' + action : ''}
      </output>
    </FoundationPage>
  );
}

export const States: StoryObj<typeof meta> = {
  render: () => <InteractionStates />,
  parameters: {
    pseudo: {
      hover: '[data-specimen="Hover"]',
      focusVisible: '[data-specimen="Focus"]',
      active: '[data-specimen="Pressed"]',
    },
  },
};
