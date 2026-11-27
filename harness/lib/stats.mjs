const Z = 1.96;

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
 * Mean of per-task paired differences with a 95% normal-approximation interval.
 * The unit is the task, so repetitions on one task do not inflate the sample.
 * Unreliable with few tasks; `n` is returned so reports can say so.
 */
export function pairedDifference(diffs) {
  const n = diffs.length;
  if (n === 0) return { diff: null, low: null, high: null, n };
  const m = mean(diffs);
  if (n === 1) return { diff: m, low: null, high: null, n };
  const sd = Math.sqrt(diffs.reduce((a, d) => a + (d - m) ** 2, 0) / (n - 1));
  const half = (Z * sd) / Math.sqrt(n);
  return { diff: m, low: m - half, high: m + half, n };
}
