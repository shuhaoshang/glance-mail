import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FoundationPage } from '../foundations/catalog';
import { DateTile } from './DateTile/DateTile';
import { Checkbox } from './Checkbox/Checkbox';
import { Switch } from './Switch/Switch';
import { Button } from './Button/Button';
import { Text } from './Text/Text';
import {
  ChecklistExample,
  SwitchExample,
  ProgressExample,
  OutlineActionsExample,
} from './RemainingExamples';
import {
  appointmentDate,
  rangeDates,
  schoolSteps,
  schoolPayLabel,
} from './remainingSamples';
import styles from './RemainingExamples.module.css';
const meta = {
  title: 'Primitives/Remaining primitives',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
export const Overview: StoryObj<typeof meta> = {
  render: () => (
    <FoundationPage
      title="Remaining primitives"
      description="Dates, checklist controls, the highlighter switch, progress, and the outline action. Examples use the supplied persona data."
    >
      <section className={styles.sheet}>
        <h2>Dates</h2>
        <div className={styles.row}>
          <DateTile date={appointmentDate} />
          {rangeDates.map((date) => (
            <DateTile key={date.month + date.day} date={date} />
          ))}
        </div>
      </section>
      <section className={styles.sheet}>
        <h2>Checkboxes and traceable facts</h2>
        <ChecklistExample />
      </section>
      <section className={styles.sheet}>
        <h2>Completed checklist</h2>
        <ChecklistExample initiallyComplete />
      </section>
      <section className={styles.sheet}>
        <h2>Switch and outline actions</h2>
        <SwitchExample />
        <OutlineActionsExample />
      </section>
      <section className={styles.sheet}>
        <h2>Progress</h2>
        <ProgressExample />
      </section>
    </FoundationPage>
  ),
};
export const States: StoryObj<typeof meta> = {
  parameters: {
    pseudo: {
      hover:
        '[data-control-state="Hover"] input, [data-control-state="Hover"] button, [data-control-state="Pressed"] input, [data-control-state="Pressed"] button',
      active:
        '[data-control-state="Pressed"] input, [data-control-state="Pressed"] button',
      focusVisible:
        '[data-control-state="Focus"] input, [data-control-state="Focus"] button',
    },
  },
  render: () => (
    <FoundationPage
      title="Control states"
      description="Compare default, hover, pressed, keyboard focus, and disabled controls in both themes."
    >
      <div className={styles.states}>
        {['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'].map((state) => (
          <section
            key={state}
            className={styles.specimen}
            data-control-state={state}
          >
            <h2>{state}</h2>
            <Checkbox
              label={schoolSteps[0].pre}
              checked={false}
              disabled={state === 'Disabled'}
              onCheckedChange={fn()}
            />
            <Checkbox
              label={schoolPayLabel}
              checked
              disabled={state === 'Disabled'}
              onCheckedChange={fn()}
            />
            <Switch
              label="Highlighter off"
              checked={false}
              disabled={state === 'Disabled'}
              onCheckedChange={fn()}
            />
            <Switch
              label="Highlighter on"
              checked
              disabled={state === 'Disabled'}
              onCheckedChange={fn()}
            />
            <Button
              variant="outline"
              disabled={state === 'Disabled'}
              onClick={fn()}
            >
              Snooze
            </Button>
          </section>
        ))}
      </div>
      <Text variant="meta">
        Off switches use theme-aware hover and pressed colors. Disabled controls
        use sunken fills and muted labels, checks, and knobs.
      </Text>
    </FoundationPage>
  ),
};
