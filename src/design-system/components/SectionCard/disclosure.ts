import { createContext, useContext, useState } from 'react';
export const SectionDisclosure = createContext<{
  active: string | null;
  toggle: (key: string) => void;
  close: () => void;
} | null>(null);

export function useSectionDisclosure() {
  const shared = useContext(SectionDisclosure);
  const [active, setActive] = useState<string | null>(null);
  return (
    shared ?? {
      active,
      toggle: (key: string) =>
        setActive((current) => (current === key ? null : key)),
      close: () => setActive(null),
    }
  );
}
