import { getPersona } from '../../data';
export const remainingMaya = getPersona('maya');
const providedSchool = getPersona('sarah').items.find(
  (item) => item.id === 'lincoln',
);
if (!providedSchool || providedSchool.scene.type !== 'checklist')
  throw new Error('Missing checklist example.');
export const school = providedSchool;
export const schoolSteps = providedSchool.scene.steps;
const providedFee = school.facts.find((fact) => fact.kind === 'money');
if (!providedFee || !schoolSteps[1].value)
  throw new Error('Missing fee example.');
export const schoolFee = providedFee;
export const schoolFeeValue = schoolSteps[1].value;
export const schoolPayLabel = schoolSteps[1].pre + schoolFeeValue;
const appointment = getPersona('sarah').items.find(
  (item) => item.id === 'riverside',
);
if (!appointment || appointment.scene.type !== 'event')
  throw new Error('Missing date example.');
export const appointmentDate = appointment.scene.tile;
const timeOff = getPersona('daniel').items.find((item) => item.id === 'lea');
if (!timeOff || timeOff.scene.type !== 'range')
  throw new Error('Missing range example.');
export const rangeDates = [timeOff.scene.from, timeOff.scene.to];
export const progressTotal =
  remainingMaya.items.filter((item) => !item.isNew).length +
  remainingMaya.doneBefore.length;
