export function ordinal(position: number) {
  const lastTwo = position % 100;
  const suffix =
    lastTwo >= 11 && lastTwo <= 13
      ? 'th'
      : (({ 1: 'st', 2: 'nd', 3: 'rd' } as Record<number, string>)[
          position % 10
        ] ?? 'th');
  return position + suffix;
}

export function reasonLabel(position: number, judgment?: string) {
  const words = [
    'first',
    'second',
    'third',
    'fourth',
    'fifth',
    'sixth',
    'seventh',
    'eighth',
    'ninth',
    'tenth',
  ];
  const rank = words[position - 1] ?? 'ranked ' + ordinal(position);
  return 'Why it’s ' + rank + (judgment ? ': ' + judgment : '');
}
