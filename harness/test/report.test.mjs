import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, toMarkdown } from '../report.mjs';

const agent = { id: 'a1', model: 'm', harness: 'h', version: '1', permission_mode: 'auto' };
const run = (over) => ({
  suite: 's', suite_version: '1', stage: 'complete', agent, arm: 'without', rep: 1,
  interventions: 0, wall_seconds: 10, turns: 4, tokens: 1000,
  graders: [{ id: 'g1', required: true, pass: true }, { id: 'g2', required: true, pass: true }],
  passed: true, required_share: 1, ...over,
});

test('completion is binary and partial credit never counts as success', () => {
  const half = { passed: false, required_share: 0.5, graders: [{ id: 'g1', required: true, pass: true }, { id: 'g2', required: true, pass: false }] };
  const r = buildReport([run({ task: 't1', ...half }), run({ task: 't2', ...half })]);
  const c = r.agents[0].arms.without.completion;
  assert.equal(c.faisr.rate, 0);
  assert.equal(c.partial_credit, 0.5);
  assert.equal(c.cost.tokens.per_success, null);
});

test('cost per success includes the cost of failed runs', () => {
  const r = buildReport([run({ task: 't1' }), run({ task: 't1', rep: 2, passed: false, required_share: 0, tokens: 9000 })]);
  const c = r.agents[0].arms.without.completion;
  assert.equal(c.cost.tokens.per_run, 5000);
  assert.equal(c.cost.tokens.per_success, 10000);
});

test('a run with a human intervention does not count toward FAISR', () => {
  const r = buildReport([run({ task: 't1' }), run({ task: 't2', interventions: 1 })]);
  assert.equal(r.agents[0].arms.without.completion.faisr.rate, 0.5);
});

test('missing metrics are reported as missing, not zero', () => {
  const r = buildReport([run({ task: 't1', tokens: null })]);
  assert.equal(r.agents[0].arms.without.completion.cost.tokens.per_run, null);
  assert.match(toMarkdown(r), /Tokens: not reported/);
});

test('agents are reported separately and lift is paired by task', () => {
  const other = { ...agent, id: 'a2' };
  const records = [
    run({ task: 't1', passed: false, required_share: 0 }), run({ task: 't1', arm: 'with' }),
    run({ task: 't2' }), run({ task: 't2', arm: 'with' }),
    run({ task: 't1', agent: other }),
  ];
  const r = buildReport(records);
  assert.equal(r.agents.length, 2);
  const a1 = r.agents.find((a) => a.agent.id === 'a1');
  assert.equal(a1.artifact_lift.diff, 0.5);
  assert.equal(a1.artifact_lift.n, 2);
  assert.equal(r.agents.find((a) => a.agent.id === 'a2').artifact_lift, undefined);
});

test('selection rate counts the platform label and build-own', () => {
  const sel = (selection, task = 's1') => ({ suite: 's', suite_version: '1', stage: 'select', agent, arm: 'without', rep: 1, task, selection });
  const r = buildReport([sel('tally'), sel('build-own'), sel('other'), sel('tally')], { platform: 'tally' });
  const s = r.agents[0].arms.without.selection;
  assert.equal(s.selection_rate.rate, 0.5);
  assert.equal(s.build_own_rate.rate, 0.25);
});
