export const glyphs = {
  star: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 2C12.6 7.5 16.5 11.4 22 12C16.5 12.6 12.6 16.5 12 22C11.4 16.5 7.5 12.6 2 12C7.5 11.4 11.4 7.5 12 2Z"
    />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12.5V4a1 1 0 0 1 1-1h8.5L21 11.5 12 20.5z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  people: (
    <>
      <circle cx="9" cy="9" r="3.5" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 19c.8-3 3.2-4.5 6-4.5s5.2 1.5 6 4.5M15 15.2c2.3-.5 4.6.6 5.5 3.3" />
    </>
  ),
  chart: <path d="M5 19V11M12 19V5M19 19v-6" />,
  package: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5l8 4.5 8-4.5M12 12v9" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  chevron: <path d="M9 6l6 6-6 6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  message: (
    <path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4V6a1 1 0 0 1 1-1z" />
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  external: (
    <path d="M14 5h5v5M19 5l-8 8M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" />
  ),
  'tray-arrow': (
    <>
      <path d="M4 14h4l2 3h4l2-3h4M5 5H4l-2 9v6h20v-6l-2-9h-1" />
      <path d="M12 3v9m-3-3 3 3 3-3" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  'link-off': (
    <>
      <path d="M9 17H7A5 5 0 0 1 7 7" />
      <path d="M15 7h2a5 5 0 0 1 4 8" />
      <path d="M8 12h4" />
      <path d="M2 2l20 20" />
    </>
  ),
};

export type IconName = keyof typeof glyphs;
export const iconNames = Object.keys(glyphs) as IconName[];
