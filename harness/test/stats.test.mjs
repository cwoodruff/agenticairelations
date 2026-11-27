import test from 'node:test';
import assert from 'node:assert/strict';
import { pairedDifference, wilson } from '../lib/stats.mjs';

test('wilson interval matches the figures quoted in the specification', () => {
  const a = wilson(10, 20);
  assert.ok(Math.abs(a.low - 0.299) < 0.002 && Math.abs(a.high - 0.701) < 0.002);
  const b = wilson(45, 90);
  assert.ok(Math.abs(b.low - 0.399) < 0.002 && Math.abs(b.high - 0.601) < 0.002);
});

test('wilson handles the edges', () => {
  assert.equal(wilson(0, 0).rate, null);
  assert.equal(wilson(0, 10).low, 0);
  assert.equal(wilson(10, 10).high, 1);
});

test('paired difference gives no interval for too few tasks or identical differences', () => {
  assert.equal(pairedDifference([]).diff, null);
  const two = pairedDifference([0.2, 0.6]);
  assert.ok(Math.abs(two.diff - 0.4) < 1e-12);
  assert.equal(two.low, null);
  assert.match(two.reason, /fewer than 3/);
  const same = pairedDifference([0.5, 0.5, 0.5, 0.5]);
  assert.equal(same.diff, 0.5);
  assert.equal(same.low, null);
  assert.match(same.reason, /identical/);
});

test('paired difference uses a t interval over tasks', () => {
  // diffs 0, 0.5, 1: mean 0.5, sd 0.5, n 3, t(2) = 4.303 -> half width 1.242
  const d = pairedDifference([0, 0.5, 1]);
  assert.equal(d.diff, 0.5);
  assert.ok(Math.abs(d.high - d.low - 2 * 1.2422) < 0.001);
  assert.ok(d.low < 0 && d.high > 0);
  // Wider than the normal approximation would give.
  assert.ok(d.high - d.low > (2 * 1.96 * 0.5) / Math.sqrt(3));
});
