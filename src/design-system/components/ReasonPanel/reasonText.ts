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
