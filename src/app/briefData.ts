import type { Persona, PersonaId } from '../data';

export function personaFromSearch(search: string): PersonaId {
  const id = new URLSearchParams(search).get('persona');
  return id === 'daniel' || id === 'sarah' ? id : 'maya';
}

export function getBriefCounts(persona: Persona) {
  const needs = persona.items.filter((item) => !item.isNew).length;
  const know = persona.goodToKnow.length;
  const aside = persona.setAside.reduce(
    (total, group) => total + group.count,
    0,
  );
  const done = persona.doneBefore.length;
  return {
    needs,
    know,
    aside,
    done,
    actions: needs + done,
    covered: needs + know + aside + done,
  };
}
