import { useEffect, useState } from 'react';
import { App } from '../app/App';
import { personaFromSearch } from '../app/briefData';
import { getPersona, type PersonaId } from '../data';
import { DemoBar } from './DemoBar';
import { TextLevels } from './TextLevels';

export type DemoLevel = 1 | 2 | 3;
interface DemoAppProps {
  initialPersonaId?: PersonaId;
  initialLevel?: DemoLevel;
  syncUrl?: boolean;
}

export function DemoApp({
  initialPersonaId,
  initialLevel = 3,
  syncUrl = false,
}: DemoAppProps) {
  const [personaId, setPersonaId] = useState<PersonaId>(
    () =>
      initialPersonaId ??
      (syncUrl ? personaFromSearch(window.location.search) : 'maya'),
  );
  const [level, setLevel] = useState<DemoLevel>(initialLevel);
  useEffect(() => {
    if (!syncUrl) return;
    const restorePersona = () =>
      setPersonaId(personaFromSearch(window.location.search));
    window.addEventListener('popstate', restorePersona);
    return () => window.removeEventListener('popstate', restorePersona);
  }, [syncUrl]);
  function changePersona(next: PersonaId) {
    if (next === personaId) return;
    if (syncUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set('persona', next);
      window.history.pushState(null, '', url);
    }
    setPersonaId(next);
  }
  return (
    <>
      <DemoBar
        personaId={personaId}
        level={level}
        onPersonaChange={changePersona}
        onLevelChange={setLevel}
      />
      <App personaId={personaId}>
        {level !== 3 ? (
          <TextLevels persona={getPersona(personaId)} level={level} />
        ) : undefined}
      </App>
    </>
  );
}
