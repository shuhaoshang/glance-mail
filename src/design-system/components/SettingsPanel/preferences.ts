export interface SettingsPreferences {
  morning: string;
  briefReady: boolean;
  watchlistChanges: boolean;
  dueToday: boolean;
  quietHours: boolean;
  from: string;
  until: string;
}

export function defaultSettings(quietHours: boolean): SettingsPreferences {
  return {
    morning: '7:30 AM',
    briefReady: true,
    watchlistChanges: true,
    dueToday: false,
    quietHours,
    from: '7:00 PM',
    until: '7:00 AM',
  };
}

export const privacyNote =
  'Glance reads your email to brief you. It never sends, deletes or changes anything in your inbox.';
