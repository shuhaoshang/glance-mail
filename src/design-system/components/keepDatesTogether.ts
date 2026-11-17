const calendarDate =
  /\b(?:(?:Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?|Sun(?:day)?),? )?(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) [1-9][0-9]?(?:[–-][1-9][0-9]?)?(?:, [0-9]{4})?\b/g;

// Preserve wrapping around each date without changing the supplied data.
export function keepDatesTogether(text: string) {
  return text.replace(calendarDate, (date) =>
    date.replaceAll(' ', '\u00a0').replace(/[–-]/g, '\u2060$&\u2060'),
  );
}
