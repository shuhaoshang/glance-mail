import daniel from './daniel.json';
import maya from './maya.json';
import sarah from './sarah.json';
import type { Persona, PersonaId } from './types';

export type { Persona, PersonaId } from './types';

// check:data validates every JSON literal against types.ts before the build.
// The unknown bridge restores unions and tuples widened by JSON imports
// after that mandatory check has verified their exact types.
// The model is documented in docs/data-model.md.
const personas: Record<PersonaId, Persona> = {
  maya: maya as unknown as Persona,
  daniel: daniel as unknown as Persona,
  sarah: sarah as unknown as Persona,
};

export function getPersona(id: PersonaId): Persona {
  return personas[id];
}
