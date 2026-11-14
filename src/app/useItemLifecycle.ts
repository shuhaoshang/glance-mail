import { useReducer } from 'react';
import type { Persona } from '../data';
import type { EmailOrigin } from '../design-system/components/MailRows/movedEmail';
import type { Destination } from '../design-system/components/MoveMenu/destinations';

export type Resolution = {
  kind: 'done' | 'snoozed';
  note: string;
  auto?: boolean;
};
export interface MoveReceipt {
  id: string;
  from: Destination;
  to: Destination;
  fromIndex: number;
  sequence: number;
}
type Orders = Record<Destination, string[]>;
type Pending =
  | { kind: 'finish'; id: string; source: 'needs-you'; result: Resolution }
  | { kind: 'move'; id: string; source: Destination; destination: Destination };
interface State {
  started: boolean;
  newAdded: boolean;
  orders: Orders;
  seen: Record<string, Destination[]>;
  records: Record<string, Resolution>;
  pending: Pending | null;
  lastMove: MoveReceipt | null;
  checks: Record<string, boolean[]>;
  asked: Record<string, number[]>;
}
type Action =
  | { type: 'begin'; id: string; result: Resolution; instant: boolean }
  | { type: 'move'; id: string; destination: Destination; instant: boolean }
  | { type: 'undoMove'; receipt: MoveReceipt }
  | { type: 'settle'; id: string }
  | { type: 'undo'; id: string }
  | { type: 'check'; id: string; values: boolean[] }
  | { type: 'ask'; id: string; index: number }
  | { type: 'addMail'; needs: string[]; other: string[] };

const tabs: Destination[] = ['needs-you', 'heads-up', 'other-mail'];
function location(orders: Orders, id: string) {
  return tabs.find((tab) => orders[tab].includes(id));
}
function initial(persona: Persona): State {
  return {
    started: false,
    newAdded: false,
    records: {},
    pending: null,
    lastMove: null,
    checks: {},
    asked: {},
    seen: {},
    orders: {
      'needs-you': persona.items
        .filter((item) => !item.isNew)
        .map((item) => item.id),
      'heads-up': persona.goodToKnow.map((item) => item.id),
      'other-mail': persona.otherMail.rows
        .filter((item) => !item.isNew)
        .map((item) => item.id),
    },
  };
}
function move(state: State, id: string, to: Destination): State {
  const from = location(state.orders, id);
  if (!from || from === to || state.records[id]) return state;
  return {
    ...state,
    started: true,
    pending: null,
    orders: {
      ...state.orders,
      [from]: state.orders[from].filter((entry) => entry !== id),
      [to]: [...state.orders[to], id],
    },
    seen: {
      ...state.seen,
      [id]: [...new Set([...(state.seen[id] ?? []), to])],
    },
    lastMove: {
      id,
      from,
      to,
      fromIndex: state.orders[from].indexOf(id),
      sequence: (state.lastMove?.sequence ?? 0) + 1,
    },
  };
}
function reducer(state: State, action: Action): State {
  if (action.type === 'addMail')
    return state.newAdded
      ? state
      : {
          ...state,
          newAdded: true,
          orders: {
            ...state.orders,
            'needs-you': [...state.orders['needs-you'], ...action.needs],
            'other-mail': [...state.orders['other-mail'], ...action.other],
          },
        };
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
  if (action.type === 'undoMove') {
    if (state.lastMove?.sequence !== action.receipt.sequence) return state;
    const { id, from, fromIndex } = action.receipt;
    const orders = Object.fromEntries(
      tabs.map((tab) => [
        tab,
        state.orders[tab].filter((entry) => entry !== id),
      ]),
    ) as Orders;
    orders[from].splice(fromIndex, 0, id);
    const records = { ...state.records };
    delete records[id];
    return {
      ...state,
      orders,
      records,
      pending: state.pending?.id === id ? null : state.pending,
    };
  }
  if (action.type === 'settle') {
    const pending = state.pending;
    if (pending?.id !== action.id) return state;
    if (pending.kind === 'move')
      return move(state, pending.id, pending.destination);
    return {
      ...state,
      records: { ...state.records, [action.id]: pending.result },
      pending: null,
    };
  }
  if (state.pending) return state;
  if (action.type === 'move') {
    const source = location(state.orders, action.id);
    if (!source || source === action.destination || state.records[action.id])
      return state;
    return action.instant
      ? move(state, action.id, action.destination)
      : {
          ...state,
          started: true,
          pending: {
            kind: 'move',
            id: action.id,
            source,
            destination: action.destination,
          },
        };
  }
  if (
    !state.orders['needs-you'].includes(action.id) ||
    state.records[action.id]?.kind === 'done'
  )
    return state;
  return action.instant || state.records[action.id]
    ? {
        ...state,
        started: true,
        records: { ...state.records, [action.id]: action.result },
      }
    : {
        ...state,
        started: true,
        pending: {
          kind: 'finish',
          id: action.id,
          source: 'needs-you',
          result: action.result,
        },
      };
}
export function useItemLifecycle(persona: Persona) {
  const [state, dispatch] = useReducer(reducer, persona, initial);
  const emails: EmailOrigin[] = [
    ...persona.items.map((item): EmailOrigin => ({ kind: 'needs-you', item })),
    ...persona.goodToKnow.map((item): EmailOrigin => ({
      kind: 'heads-up',
      item,
    })),
    ...persona.otherMail.rows.map((item): EmailOrigin => ({
      kind: 'other-mail',
      item,
    })),
  ];
  const byId = new Map(emails.map((email) => [email.item.id, email]));
  const rows = Object.fromEntries(
    tabs.map((tab) => [
      tab,
      state.orders[tab]
        .filter((id) => tab !== 'needs-you' || !state.records[id])
        .map((id) => byId.get(id)!),
    ]),
  ) as Record<Destination, EmailOrigin[]>;
  const values = state.orders['needs-you'].flatMap((id) =>
    state.records[id] ? [state.records[id]] : [],
  );
  const snoozed = values.filter((record) => record.kind === 'snoozed').length;
  const done =
    persona.doneBefore.length +
    values.filter((record) => record.kind === 'done').length;
  const hiddenOther =
    persona.otherMail.total -
    persona.otherMail.rows.filter((item) => !item.isNew).length;
  const counts = {
    needs: rows['needs-you'].length,
    done,
    snoozed,
    know: rows['heads-up'].length,
    other: hiddenOther + rows['other-mail'].length,
    actions: state.orders['needs-you'].length + persona.doneBefore.length,
    covered:
      persona.coverage.emails +
      (state.newAdded ? (persona.newMail?.emails ?? 0) : 0),
  };
  const instant = (immediate: boolean) =>
    immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function finish(id: string, result: Resolution, immediate = false) {
    dispatch({ type: 'begin', id, result, instant: instant(immediate) });
  }
  return {
    ...state,
    emails,
    rows,
    counts,
    hiddenOther,
    location: (id: string) => location(state.orders, id),
    addMail: () => {
      if (persona.newMail)
        dispatch({
          type: 'addMail',
          needs: persona.items
            .filter((item) => item.isNew)
            .map((item) => item.id),
          other: persona.otherMail.rows
            .filter((item) => item.isNew)
            .map((item) => item.id),
        });
    },
    move: (id: string, destination: Destination) =>
      dispatch({ type: 'move', id, destination, instant: instant(false) }),
    undoMove: (receipt: MoveReceipt) => dispatch({ type: 'undoMove', receipt }),
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
      state.records[persona.demo.simulate.item]?.kind === 'done' ||
      !state.orders['needs-you'].includes(persona.demo.simulate.item),
  };
}
export type ItemLifecycle = ReturnType<typeof useItemLifecycle>;
