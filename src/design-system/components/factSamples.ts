import { getPersona } from '../../data';
import type { Fact, FieldSpec, Item } from '../../data/types';

export interface FactSample {
  item: Item;
  fact: Fact;
  field: FieldSpec;
}

function sample(
  persona: 'maya' | 'sarah',
  itemId: string,
  factId: string,
): FactSample {
  const item = getPersona(persona).items.find((item) => item.id === itemId);
  const fact = item?.facts.find((fact) => fact.id === factId);
  if (!item || !fact || !('fields' in item.scene))
    throw new Error('Missing fact example.');
  const field = item.scene.fields.find((field) => field.fact === factId);
  if (!field) throw new Error('Missing field example.');
  return { item, fact, field };
}

export const factSamples = {
  money: sample('maya', 'fernway', 'f2'),
  time: sample('sarah', 'lincoln', 'f1'),
  people: sample('maya', 'halden', 'f2'),
};
export const urgentFact = factSamples.time.fact;
const plainScene = getPersona('sarah').items.find(
  (item) => item.id === 'riverside',
)?.scene;
if (!plainScene || plainScene.type !== 'event')
  throw new Error('Missing plain field example.');
const providedField = plainScene.fields.find((field) => !field.fact);
if (!providedField) throw new Error('Missing unsourced field.');
export const plainField = providedField;
const providedEvidence = getPersona('maya').items[0].judgments[0].source;
if (!providedEvidence) throw new Error('Missing judgment evidence.');

export const evidence = providedEvidence;
