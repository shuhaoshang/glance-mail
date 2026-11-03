import { getPersona, type PersonaId } from '../data';
import styles from './App.module.css';

interface AppProps {
  personaId: PersonaId;
}

export function App({ personaId }: AppProps) {
  const persona = getPersona(personaId);

  return (
    <main className={styles.page}>
      <h1 className={styles.wordmark}>Glance</h1>
      <p className={styles.persona}>{persona.name}</p>
    </main>
  );
}
