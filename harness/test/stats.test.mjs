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

test('paired difference uses tasks as the unit', () => {
  const d = pairedDifference([0.5, 0.5, 0.5]);
  assert.equal(d.diff, 0.5);
  assert.equal(d.low, 0.5);
  assert.equal(pairedDifference([0.2]).low, null);
  const mixed = pairedDifference([1, -1, 1, -1]);
  assert.equal(mixed.diff, 0);
  assert.ok(mixed.low < 0 && mixed.high > 0);
});
