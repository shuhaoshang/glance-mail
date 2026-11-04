/** Keep the displayed rules in sync with the numbered sections in the handoff. */
export function section(markdown: string, heading: string): string {
  const text = markdown
    .split(/^## /m)
    .find((part) => part.startsWith(heading + '\n'));
  if (text === undefined)
    throw new Error(`Missing design document section: ${heading}`);
  return text
    .slice(heading.length)
    .replace(/\n---\s*$/, '')
    .trim();
}
