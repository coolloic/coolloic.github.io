const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/**
 * Accepts 'present', a bare year ('2022'), or a year and month ('2022-01').
 *
 * Year-only is a first-class case, not a fallback: most roles are dated to the
 * year because the source did not support month precision, and rendering a
 * month there would imply a certainty that does not exist.
 */
function formatOne(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month] = value.split('-');
  if (!year) return value;
  if (month === undefined) return year;
  const index = Number(month) - 1;
  if (Number.isNaN(index) || index < 0 || index > 11) return year;
  return `${MONTHS[index]} ${year}`;
}

/**
 * Returns a readable date range, or null when either bound is missing.
 *
 * Null is deliberate: the source CV did not contain dates for several roles,
 * and inventing them would put false claims on a public page. Callers must
 * render no date element when this returns null.
 */
export function formatRange(start: string | null, end: string | null): string | null {
  if (start === null || end === null) return null;
  const from = formatOne(start);
  const to = formatOne(end);
  // A short role inside one year reads as "2022", not "2022 – 2022".
  return from === to ? from : `${from} – ${to}`;
}
