import { useId, useLayoutEffect, useRef } from 'react';
import { Button } from '../Button/Button';
import { privacyNote } from '../SettingsPanel/preferences';
import styles from './SignedOutPanel.module.css';

export function SignedOutPanel({ onSignIn }: { onSignIn: () => void }) {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    heading.current?.focus();
  }, []);

  return (
    <section className={styles.panel} aria-labelledby={id}>
      <h1 id={id} tabIndex={-1} ref={heading}>
        You’re signed out
      </h1>
      <p className={styles.subtitle}>Sign in to see your brief.</p>
      <div className={styles.actions}>
        <Button variant="outline" size="touch" onClick={onSignIn}>
          Continue with Microsoft
        </Button>
        <Button variant="outline" size="touch" onClick={onSignIn}>
          Continue with Google
        </Button>
      </div>
      <p className={styles.privacy}>{privacyNote}</p>
    </section>
  );
}
