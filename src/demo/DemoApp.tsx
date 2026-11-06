import { useEffect, useState } from 'react';
import { useItemLifecycle } from '../app/useItemLifecycle';
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
    <PersonaDemo
      key={personaId}
      personaId={personaId}
      level={level}
      changePersona={changePersona}
      setLevel={setLevel}
      syncUrl={syncUrl}
    />
  );
}
function PersonaDemo({
  personaId,
  level,
  changePersona,
  setLevel,
  syncUrl,
}: {
  personaId: PersonaId;
  level: DemoLevel;
  changePersona: (id: PersonaId) => void;
  setLevel: (level: DemoLevel) => void;
  syncUrl: boolean;
}) {
  const session = useItemLifecycle(getPersona(personaId));
  return (
    <>
      <DemoBar
        personaId={personaId}
        level={level}
        onPersonaChange={changePersona}
        onLevelChange={(next) => {
          if (next !== 3 && session.pending) session.settle(session.pending.id);
          setLevel(next);
        }}
        simulation={{
          label: session.simulateLabel,
          disabled: session.simulateDisabled,
          onClick: () => session.simulate(level !== 3),
        }}
      />
      <App
        personaId={personaId}
        session={session}
        startClean={
          syncUrl &&
          new URLSearchParams(window.location.search).get('start') === 'clean'
        }
      >
        {level !== 3 ? (
          <TextLevels persona={getPersona(personaId)} level={level} />
        ) : undefined}
      </App>
    </>
  );
}
