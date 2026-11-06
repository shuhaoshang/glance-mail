import { useId, useRef, useState } from 'react';
import type { Item } from '../../../data/types';
import { Text } from '../Text/Text';
import { Icon } from '../Icon/Icon';
import { Highlight } from '../Highlight/Highlight';
import { Button } from '../Button/Button';
import motion from '../ListMotion.module.css';
import styles from './AskThread.module.css';
function Content({
  item,
  initialAsked = [],
}: {
  item: Item;
  initialAsked?: number[];
}) {
  const [asked, setAsked] = useState(initialAsked);
  const prefix = useId();
  const root = useRef<HTMLElement>(null);
  function ask(index: number) {
    setAsked((current) =>
      current.includes(index) ? current : [...current, index],
    );
    requestAnimationFrame(() =>
      root.current
        ?.querySelector<HTMLElement>('[data-answer="' + index + '"]')
        ?.focus({ preventScroll: true }),
    );
  }
  return (
    <section ref={root} aria-label="Ask Glance" className={styles.thread}>
      <Text as="p" variant="meta">
        Answers come only from your email. When something isn’t there, Glance
        says so instead of guessing.
      </Text>
      <div
        id={prefix + '-history'}
        role="log"
        aria-label="Questions and answers"
        aria-live="polite"
        aria-relevant="additions"
        className={styles.history}
      >
        {asked.map((index) => {
          const qa = item.qa[index];
          return (
            <div key={index} className={styles.exchange}>
              <Text
                as="p"
                variant="body"
                className={[styles.question, motion.enter].join(' ')}
              >
                {qa.q}
              </Text>
              <section
                data-answer={index}
                aria-label={'Answer to ' + qa.q}
                tabIndex={-1}
                className={[
                  qa.found ? styles.answer : styles.notFound,
                  motion.enter,
                ].join(' ')}
              >
                {qa.found ? (
                  <>
                    <span className={styles.brand}>
                      <Icon name="star" size="small" />
                      Glance
                    </span>
                    <Text as="p" variant="body">
                      {qa.a}
                    </Text>
                    {qa.source && (
                      <div className={styles.source}>
                        <Text as="p" variant="meta">
                          {'Based on · ' +
                            qa.source.from +
                            ' · ' +
                            qa.source.when}
                        </Text>
                        <Text as="p" variant="reading">
                          {qa.source.pre}
                          <Highlight kind="judgment" wrap>
                            {qa.source.hl}
                          </Highlight>
                          {qa.source.post}
                        </Text>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Text as="h3" variant="body" className={styles.label}>
                      Not in your email
                    </Text>
                    <Text as="p" variant="body">
                      {qa.a}
                    </Text>
                  </>
                )}
              </section>
            </div>
          );
        })}
      </div>
      {asked.length < item.qa.length && (
        <div className={styles.suggestions}>
          <Text as="p" variant="meta" className={styles.label}>
            Try asking
          </Text>
          <div className={styles.options}>
            {item.qa.map((qa, index) =>
              asked.includes(index) ? null : (
                <Button
                  key={qa.q}
                  variant="outline"
                  aria-controls={prefix + '-history'}
                  onClick={() => ask(index)}
                >
                  {qa.q}
                </Button>
              ),
            )}
          </div>
        </div>
      )}
      <Text as="p" variant="meta" className={styles.note}>
        <strong>Demo:</strong>
        {asked.length === item.qa.length
          ? ' that’s every prepared question for this item.'
          : ' answers are prepared in advance, so pick a question above. In the product you type your own.'}
      </Text>
    </section>
  );
}

export function AskThread(props: Parameters<typeof Content>[0]) {
  return <Content key={props.item.id} {...props} />;
}
