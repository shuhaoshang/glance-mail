import { useReducer } from 'react';
import type { Persona } from '../data';
export type Resolution = {
  kind: 'done' | 'snoozed' | 'moved';
  note: string;
  auto?: boolean;
};
interface State {
  started: boolean;
  records: Record<string, Resolution>;
  pending: { id: string; result: Resolution } | null;
  checks: Record<string, boolean[]>;
}
type Action =
  | { type: 'begin'; id: string; result: Resolution; instant: boolean }
  | { type: 'settle'; id: string }
  | { type: 'undo'; id: string }
  | { type: 'check'; id: string; values: boolean[] };
const initial: State = {
  started: false,
  records: {},
  pending: null,
  checks: {},
};
function reducer(state: State, action: Action): State {
  if (action.type === 'check')
    return {
      ...state,
      checks: { ...state.checks, [action.id]: action.values },
    };
  if (action.type === 'undo') {
    if (state.pending) return state;
    const records = { ...state.records };
    delete records[action.id];
    return { ...state, records };
  }
  if (action.type === 'settle')
    return state.pending?.id === action.id
      ? {
          ...state,
          records: { ...state.records, [action.id]: state.pending.result },
          pending: null,
        }
      : state;
  if (state.pending) return state;
  return action.instant || state.records[action.id]
    ? {
        ...state,
        started: true,
        records: { ...state.records, [action.id]: action.result },
      }
    : {
        ...state,
        started: true,
        pending: { id: action.id, result: action.result },
      };
}
export function useItemLifecycle(persona: Persona) {
  const [state, dispatch] = useReducer(reducer, initial);
  const items = persona.items.filter((item) => !item.isNew);
  const active = items.filter((item) => !state.records[item.id]);
  const values = Object.values(state.records);
  const moved = values.filter((r) => r.kind === 'moved').length;
  const snoozed = values.filter((r) => r.kind === 'snoozed').length;
  const done =
    persona.doneBefore.length + values.filter((r) => r.kind === 'done').length;
  const aside = persona.setAside.reduce((n, g) => n + g.count, 0) + moved;
  const counts = {
    needs: active.length,
    done,
    aside,
    snoozed,
    know: persona.goodToKnow.length,
    actions: items.length + persona.doneBefore.length - moved,
    covered: active.length + done + aside + snoozed + persona.goodToKnow.length,
  };
  function finish(id: string, result: Resolution, immediate = false) {
    if (!items.some((item) => item.id === id)) return;
    dispatch({
      type: 'begin',
      id,
      result,
      instant:
        immediate ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    });
  }
  return {
    ...state,
    active,
    counts,
    finish,
    settle: (id: string) => dispatch({ type: 'settle', id }),
    undo: (id: string) => dispatch({ type: 'undo', id }),
    check: (id: string, values: boolean[]) =>
      dispatch({ type: 'check', id, values }),
    simulate: (immediate = false) =>
      finish(
        persona.demo.simulate.item,
        {
          kind: 'done',
          note: persona.demo.simulate.note,
          auto: true,
        },
        immediate,
      ),
    simulateLabel:
      state.records[persona.demo.simulate.item]?.kind === 'done'
        ? state.records[persona.demo.simulate.item].auto
          ? persona.demo.simulate.detected
          : persona.demo.simulate.already
        : persona.demo.simulate.label,
    simulateDisabled:
      !!state.pending ||
      state.records[persona.demo.simulate.item]?.kind === 'done',
  };
}
export type ItemLifecycle = ReturnType<typeof useItemLifecycle>;
