const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatOne(value: string): string {
  if (value === 'present') return 'Present';
  const [year, month] = value.split('-');
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || index < 0 || index > 11) return year ?? value;
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
  return `${formatOne(start)} – ${formatOne(end)}`;
}
