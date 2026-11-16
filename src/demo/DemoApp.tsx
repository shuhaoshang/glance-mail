import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { useItemLifecycle } from '../app/useItemLifecycle';
import { App } from '../app/App';
import { personaFromSearch } from '../app/briefData';
import { getPersona, type PersonaId } from '../data';
import { DemoBar } from './DemoBar';
import { TextLevels } from './TextLevels';
import type { ThemeControl } from '../design-system/components/AccountMenu/themeOptions';

export type DemoLevel = 1 | 2 | 3;
interface DemoAppProps {
  initialPersonaId?: PersonaId;
  initialLevel?: DemoLevel;
  syncUrl?: boolean;
  theme?: ThemeControl;
}

export function DemoApp({
  initialPersonaId,
  initialLevel = 3,
  syncUrl = false,
  theme,
}: DemoAppProps) {
  const [personaId, setPersonaId] = useState<PersonaId>(
    () =>
      initialPersonaId ??
      (syncUrl ? personaFromSearch(window.location.search) : 'maya'),
  );
  const [level, setLevel] = useState<DemoLevel>(initialLevel);
  const [expanded, setExpanded] = useState(false);
  const selectedPersona = useRef<HTMLButtonElement>(null);
  const restorePersonaFocus = useRef(false);
  useLayoutEffect(() => {
    if (restorePersonaFocus.current) {
      restorePersonaFocus.current = false;
      selectedPersona.current?.focus();
    }
  }, [personaId]);
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
    restorePersonaFocus.current = true;
    setPersonaId(next);
  }
  return (
    <PersonaDemo
      key={personaId}
      personaId={personaId}
      level={level}
      disclosure={{
        expanded,
        onExpandedChange: setExpanded,
        selectedPersona,
        onPersonaChange: changePersona,
      }}
      setLevel={setLevel}
      syncUrl={syncUrl}
      theme={theme}
    />
  );
}
function PersonaDemo({
  personaId,
  level,
  disclosure,
  setLevel,
  syncUrl,
  theme,
}: {
  personaId: PersonaId;
  level: DemoLevel;
  disclosure: Pick<
    ComponentProps<typeof DemoBar>,
    'expanded' | 'onExpandedChange' | 'selectedPersona' | 'onPersonaChange'
  >;
  setLevel: (level: DemoLevel) => void;
  syncUrl: boolean;
  theme?: ThemeControl;
}) {
  const session = useItemLifecycle(getPersona(personaId));
  return (
    <>
      <DemoBar
        personaId={personaId}
        level={level}
        {...disclosure}
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
        theme={theme}
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
