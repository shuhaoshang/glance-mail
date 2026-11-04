import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationPage } from '../../foundations/catalog';
import { Icon } from './Icon';
import { iconNames } from './glyphs';
import styles from './Icon.stories.module.css';

const meta = {
  title: 'Foundations/Icons',
  component: Icon,
  args: { name: 'mail', size: 'default' },
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: 'inline-radio', options: ['small', 'default', 'large'] },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Gallery: Story = {
  parameters: { layout: 'fullscreen', controls: { include: ['size'] } },
  render: ({ size }) => (
    <FoundationPage
      title="Icons"
      description="Each icon inherits the text colour. Use the size control to compare the three token sizes."
    >
      <ul className={styles.gallery}>
        {iconNames.map((name) => (
          <li key={name} className={styles.tile}>
            <Icon name={name} size={size} />
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </FoundationPage>
  ),
};

export const Standalone: Story = {
  parameters: {
    layout: 'centered',
    controls: { include: ['name', 'size', 'label'] },
  },
  args: { label: 'Email' },
};
