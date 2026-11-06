import type { Meta, StoryObj } from '@storybook/react-vite';
import { FoundationPage } from '../../foundations/catalog';
import { SceneExample } from './SceneExample';
import { sceneSamples } from './sceneSamples';
import styles from './SceneExample.module.css';

const meta = {
  title: 'Scene cards/Gallery',
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Overview: Story = {
  render: () => (
    <FoundationPage
      title="Scene cards"
      description="Eight data-driven layouts and the text fallback. Select a value to verify its source; checklist progress stays local."
    >
      <div className={styles.gallery}>
        {Object.entries(sceneSamples).map(([name, sample]) => (
          <section className={styles.sheet} key={name}>
            <h2>
              {name === 'Text'
                ? 'Text fallback'
                : name === 'NewLead'
                  ? 'Deal · new lead'
                  : name}
            </h2>
            <SceneExample {...sample} />
          </section>
        ))}
      </div>
    </FoundationPage>
  ),
};
export const DarkTheme: Story = { ...Overview, globals: { theme: 'dark' } };
