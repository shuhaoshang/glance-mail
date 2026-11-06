import { getPersona } from '../../../data';
import type { PersonaId } from '../../../data/types';
export function sceneSample(persona: PersonaId, id: string) {
  const data = getPersona(persona);
  const item = data.items.find((entry) => entry.id === id);
  if (!item) throw new Error('Missing scene example: ' + id);
  const account = data.accounts.find((entry) => entry.id === item.account);
  if (!account) throw new Error('Missing scene account.');
  return { item, account };
}
export const sceneSamples = {
  Deal: sceneSample('maya', 'fernway'),
  NewLead: sceneSample('maya', 'halden'),
  Decision: sceneSample('daniel', 'checkout'),
  Approval: sceneSample('daniel', 'expense'),
  Payment: sceneSample('sarah', 'water'),
  Mismatch: sceneSample('maya', 'okto'),
  Event: sceneSample('sarah', 'riverside'),
  Range: sceneSample('daniel', 'lea'),
  Checklist: sceneSample('sarah', 'lincoln'),
  Text: sceneSample('maya', 'brightline'),
};
