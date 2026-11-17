import type { PersonaId } from '../data';

export function personaFromSearch(search: string): PersonaId {
  const id = new URLSearchParams(search).get('persona');
  return id === 'daniel' || id === 'sarah' ? id : 'maya';
}
