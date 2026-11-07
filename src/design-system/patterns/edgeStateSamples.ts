import type { BriefRowItem } from '../components/BriefRow/BriefRow';
import type { FactKind } from '../../data/types';

type Chip = [kind: FactKind, label: string, urgent?: boolean];

function overloadRow(
  id: string,
  name: string,
  account: 'gmail' | 'yahoo',
  type: BriefRowItem['request']['type'],
  text: string,
  chips: Chip[],
): BriefRowItem & { account: string } {
  return {
    id,
    name,
    account,
    request: { type, text },
    facts: chips.map(([kind, label, urgent = false], index) => ({
      id: id + '-' + index,
      kind,
      label,
      urgent,
    })),
  };
}

export const overloadRows = [
  overloadRow(
    'overdue-water',
    'City Water',
    'gmail',
    'quote',
    '“Your November payment is 4 days overdue.”',
    [
      ['time', 'Overdue 4 days', true],
      ['money', '$68.40'],
    ],
  ),
  overloadRow(
    'lincoln-conference',
    'Lincoln Elementary',
    'yahoo',
    'summary',
    'Book a parent–teacher conference slot',
    [['time', 'Sign-up closes tomorrow', true]],
  ),
  overloadRow(
    'thanksgiving',
    'Mom',
    'gmail',
    'quote',
    '“Can you tell me by Wednesday if you’re coming for Thanksgiving?”',
    [
      ['time', 'Waiting 6 days', true],
      ['time', 'Reply by Wed'],
    ],
  ),
  overloadRow(
    'riverside-flu',
    'Riverside Pediatrics',
    'gmail',
    'quote',
    '“Reply C to confirm Ella’s flu shot.”',
    [['time', 'Thu, 4:00 PM']],
  ),
  overloadRow(
    'lincoln-class-party',
    'Lincoln Elementary',
    'yahoo',
    'summary',
    'Send a snack for Friday’s class party',
    [['time', 'Fri, Nov 20']],
  ),
  overloadRow(
    'jess-playdate',
    'Jess Moore',
    'gmail',
    'quote',
    '“Are you still up for the playdate on Saturday?”',
    [['time', 'Sat, Nov 21']],
  ),
  overloadRow(
    'winter-soccer',
    'Westside Soccer',
    'gmail',
    'summary',
    'Pay for the winter season',
    [
      ['time', 'Due Nov 22'],
      ['money', '$85'],
    ],
  ),
  overloadRow(
    'winter-parking',
    'Maple Court HOA',
    'gmail',
    'quote',
    '“Please confirm your winter parking spot by Nov 25.”',
    [['time', 'Reply by Nov 25']],
  ),
  overloadRow(
    'ella-cleaning',
    'Oak Street Dental',
    'gmail',
    'quote',
    '“Please call us to book Ella’s cleaning.”',
    [['time', 'Book by Nov 30']],
  ),
  overloadRow(
    'winter-camp',
    'Little Sprouts Camp',
    'gmail',
    'summary',
    'Choose a week of winter break camp',
    [
      ['time', 'Sign up by Dec 1'],
      ['money', '$180/week'],
    ],
  ),
  overloadRow(
    'rain-boots',
    'Kids Corner',
    'gmail',
    'summary',
    'Return the rain boots for a refund',
    [
      ['time', 'Return by Dec 4'],
      ['money', '$34.99'],
    ],
  ),
  overloadRow(
    'book-fair',
    'Lincoln PTA',
    'yahoo',
    'quote',
    '“Can you volunteer at the book fair?”',
    [['time', 'Dec 9–11']],
  ),
];
