import { useReducer } from 'react';
import type { Persona } from '../data';
export type Resolution = {
  kind: 'done' | 'snoozed' | 'moved';
  note: string;
  auto?: boolean;
};
interface State {
  started: boolean;
  newAdded: boolean;
  kept: Record<string, boolean>;
  records: Record<string, Resolution>;
  pending: { id: string; result: Resolution } | null;
  checks: Record<string, boolean[]>;
  asked: Record<string, number[]>;
}
type Action =
  | { type: 'begin'; id: string; result: Resolution; instant: boolean }
  | { type: 'settle'; id: string }
  | { type: 'undo'; id: string }
  | { type: 'check'; id: string; values: boolean[] }
  | { type: 'ask'; id: string; index: number }
  | { type: 'addMail' }
  | { type: 'keep'; id: string; value: boolean };
const initial: State = {
  started: false,
  newAdded: false,
  kept: {},
  records: {},
  pending: null,
  checks: {},
  asked: {},
};
function reducer(state: State, action: Action): State {
  if (action.type === 'addMail')
    return state.newAdded ? state : { ...state, newAdded: true };
  if (action.type === 'keep')
    return { ...state, kept: { ...state.kept, [action.id]: action.value } };
  if (action.type === 'ask') {
    const asked = state.asked[action.id] ?? [];
    return asked.includes(action.index)
      ? state
      : {
          ...state,
          asked: { ...state.asked, [action.id]: [...asked, action.index] },
        };
  }
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
  const baseItems = persona.items.filter((item) => !item.isNew);
  const items = state.newAdded
    ? [...baseItems, ...persona.items.filter((item) => item.isNew)]
    : baseItems;
  const groups = persona.setAside.map((group) => {
    const rows = group.rows.filter((row) => !row.isNew || state.newAdded);
    return {
      ...group,
      rows,
      count:
        group.count +
        rows.filter((row) => row.isNew).length -
        rows.filter((row) => state.kept[row.id]).length,
    };
  });
  const keptRows = groups.flatMap((group) =>
    group.rows.filter((row) => state.kept[row.id]),
  );
  const active = items.filter((item) => !state.records[item.id]);
  const values = Object.values(state.records);
  const moved = values.filter((r) => r.kind === 'moved').length;
  const snoozed = values.filter((r) => r.kind === 'snoozed').length;
  const done =
    persona.doneBefore.length + values.filter((r) => r.kind === 'done').length;
  const aside = groups.reduce((n, g) => n + g.count, 0) + moved;
  const counts = {
    needs: active.length,
    done,
    aside,
    snoozed,
    know: persona.goodToKnow.length + keptRows.length,
    actions: items.length + persona.doneBefore.length - moved,
    covered:
      active.length +
      done +
      aside +
      snoozed +
      persona.goodToKnow.length +
      keptRows.length,
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
    groups,
    keptRows,
    movedItems: items.filter(
      (item) => state.records[item.id]?.kind === 'moved',
    ),
    addMail: () => {
      if (persona.newMail) dispatch({ type: 'addMail' });
    },
    keep: (id: string) => {
      if (groups.some((g) => g.rows.some((row) => row.id === id)))
        dispatch({ type: 'keep', id, value: true });
    },
    undoKeep: (id: string) => dispatch({ type: 'keep', id, value: false }),
    counts,
    finish,
    ask: (id: string, index: number) => dispatch({ type: 'ask', id, index }),
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
