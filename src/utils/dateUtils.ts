import { WEDDING_DATE } from "../data/milestones";

const MS_PER_DAY = 86_400_000;

/** Parse "YYYY-MM-DD" as a UTC midnight timestamp (avoids timezone/DST drift). */
function toUTC(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/**
 * Whole-day difference between a milestone date and the wedding date.
 *   negative  -> before the wedding
 *   0         -> the wedding day
 *   positive  -> after the wedding
 */
export function daysFromWedding(dateISO: string): number {
  return Math.round((toUTC(dateISO) - toUTC(WEDDING_DATE)) / MS_PER_DAY);
}

/** Subtitle that explains what the counter is currently measuring. */
export function counterLabel(days: number): string {
  if (days < 0) return "Days until we became family";
  if (days === 0) return "The day we became family";
  return "Days since we got married";
}

/** Format the big number: a true en-dash minus for negatives, grouped thousands. */
export function formatCount(days: number): string {
  const sign = days < 0 ? "−" : ""; // − (minus sign, not hyphen)
  return sign + Math.abs(days).toLocaleString("en-US");
}
