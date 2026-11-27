const Z = 1.96;

// Two-sided 95% Student t quantiles for 1..30 degrees of freedom.
const T975 = [
  12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201, 2.179, 2.16, 2.145,
  2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064, 2.06, 2.056, 2.052, 2.048,
  2.045, 2.042,
];

/** Fewest tasks for which a paired interval is reported at all. */
export const MIN_TASKS_FOR_INTERVAL = 3;

/** 95% Wilson score interval for k successes in n trials. Assumes independent trials. */
export function wilson(k, n) {
  if (n === 0) return { rate: null, low: null, high: null, n: 0 };
  const p = k / n;
  const d = 1 + (Z * Z) / n;
  const centre = (p + (Z * Z) / (2 * n)) / d;
  const half = (Z * Math.sqrt((p * (1 - p)) / n + (Z * Z) / (4 * n * n))) / d;
  return { rate: p, low: Math.max(0, centre - half), high: Math.min(1, centre + half), n };
}

export function mean(xs) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
}

/**
 * Mean of per-task paired differences with a 95% t interval. The unit is the
 * task, so repetitions on one task do not inflate the sample.
 *
 * No interval is given with fewer than MIN_TASKS_FOR_INTERVAL tasks, or when
 * every difference is identical (the sample then says nothing about spread).
 */
export function pairedDifference(diffs) {
  const n = diffs.length;
  const none = { low: null, high: null, n };
  if (n === 0) return { diff: null, ...none, reason: 'no paired tasks' };
  const m = mean(diffs);
  if (n < MIN_TASKS_FOR_INTERVAL) return { diff: m, ...none, reason: `fewer than ${MIN_TASKS_FOR_INTERVAL} tasks` };
  const sd = Math.sqrt(diffs.reduce((a, d) => a + (d - m) ** 2, 0) / (n - 1));
  if (sd === 0) return { diff: m, ...none, reason: 'identical differences on every task' };
  const t = n - 1 <= T975.length ? T975[n - 2] : Z;
  const half = (t * sd) / Math.sqrt(n);
  return { diff: m, low: m - half, high: m + half, n, reason: null };
}
