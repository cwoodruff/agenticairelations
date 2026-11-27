import test from 'node:test';
import assert from 'node:assert/strict';
import { buildReport, toMarkdown } from '../report.mjs';

const agent = { id: 'a1', model: 'm', harness: 'h', version: '1', permission_mode: 'auto', share_home: false };
const run = (over) => ({
  suite: 's', suite_version: '1', stage: 'complete', agent, arm: 'without', rep: 1, error: null,
  started: '2026-11-27T10:00:00.000Z', budget: { max_minutes: 20, max_turns: 60 },
  interventions: 0, wall_seconds: 10, turns: 4, tokens: 1000, cost_usd: null,
  timed_out: false, agent_exit_code: 0,
  graders: [{ id: 'g1', required: true, pass: true }, { id: 'g2', required: true, pass: true }],
  passed: true, required_share: 1, ...over,
});
const failed = { passed: false, required_share: 0 };

test('completion is binary and partial credit never counts as success', () => {
  const half = { passed: false, required_share: 0.5 };
  const r = buildReport([run({ task: 't1', ...half }), run({ task: 't2', ...half })]);
  const c = r.agents[0].arms.without.completion;
  assert.equal(c.faisr.rate, 0);
  assert.equal(c.partial_credit, 0.5);
  assert.equal(c.cost.tokens.per_success, null);
});

test('cost per success includes the cost of failed runs', () => {
  const r = buildReport([run({ task: 't1' }), run({ task: 't1', rep: 2, ...failed, tokens: 9000 })]);
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
  const md = toMarkdown(r);
  assert.match(md, /Tokens: not reported/);
  assert.match(md, /Money \(USD\): not reported/);
});

test('errored runs are excluded from every figure and listed', () => {
  const errored = { task: 't1', rep: 2, error: 'setup failed (exit 7): ', passed: undefined, wall_seconds: undefined };
  const r = buildReport([run({ task: 't1' }), run(errored)]);
  const e = r.agents[0];
  const c = e.arms.without.completion;
  assert.equal(c.runs, 1);
  assert.equal(c.faisr.rate, 1);
  assert.equal(c.cost.wall_seconds.per_run, 10);
  assert.equal(e.errors.length, 1);
  assert.match(toMarkdown(r), /1 run\(s\) had infrastructure errors and are excluded/);
});

test('errored selection runs are not counted as a choice', () => {
  const sel = (over) => ({ suite: 's', suite_version: '1', stage: 'select', agent, arm: 'without', rep: 1, task: 's1', error: null, started: '2026-11-27T10:00:00.000Z', ...over });
  const r = buildReport([sel({ selection: 'tally' }), sel({ rep: 2, error: 'classify failed (exit 1)' })], { platform: 'tally' });
  const s = r.agents[0].arms.without.selection;
  assert.equal(s.runs, 1);
  assert.equal(s.selection_rate.rate, 1);
  assert.deepEqual(s.choices, { tally: 1 });
});

test('selection rate counts the platform label and build-own', () => {
  const sel = (selection) => ({ suite: 's', suite_version: '1', stage: 'select', agent, arm: 'without', rep: 1, task: 's1', error: null, selection });
  const r = buildReport([sel('tally'), sel('build-own'), sel('other'), sel('tally')], { platform: 'tally' });
  const s = r.agents[0].arms.without.selection;
  assert.equal(s.selection_rate.rate, 0.5);
  assert.equal(s.build_own_rate.rate, 0.25);
});

test('agents differing in model or suite version are never pooled', () => {
  const records = [
    run({ task: 't1' }),
    run({ task: 't1', agent: { ...agent, model: 'm2' } }),
    run({ task: 't1', suite_version: '2' }),
  ];
  assert.equal(buildReport(records).agents.length, 3);
});

test('lift is paired by task, on completion and on cost', () => {
  const records = [];
  for (const [task, without, withArm] of [['t1', failed, {}], ['t2', {}, {}], ['t3', failed, {}], ['t4', {}, failed]]) {
    records.push(run({ task, ...without, tokens: 2000 }), run({ task, arm: 'with', ...withArm, tokens: 1500 }));
  }
  const lift = buildReport(records).agents[0].artifact_lift;
  // per-task differences: +1, 0, +1, -1 -> mean 0.25
  assert.equal(lift.completion.diff, 0.25);
  assert.equal(lift.completion.n, 4);
  assert.ok(lift.completion.low < 0 && lift.completion.high > 0);
  assert.equal(lift.tokens.diff, -500);
  assert.match(lift.tokens.reason, /identical/);
  const md = toMarkdown(buildReport(records));
  assert.match(md, /Completion: \+25\.0 percentage points/);
  assert.match(md, /inconclusive, which is not the same as no effect/);
  assert.match(md, /Tokens per run: -500 tokens \(4 tasks; no interval/);
});

test('the report states what the specification requires of a report', () => {
  const md = toMarkdown(buildReport([run({ task: 't1' }), run({ task: 't1', rep: 2 })]));
  assert.match(md, /Model: m\. Tool: h 1\. Permission mode: auto\./);
  assert.match(md, /Suite: s@1, 1 tasks\. Runs from 2026-11-27/);
  assert.match(md, /Repetitions per task and arm: 2\./);
  assert.match(md, /Budgets: 20 minutes, 60 turn limit/);
  assert.match(md, /Human interventions allowed: 0/);
  assert.doesNotMatch(md, /Below the specification/);
  const once = toMarkdown(buildReport([run({ task: 't1' })]));
  assert.match(once, /Below the specification/);
});

test('timeouts, agent error exits and failed teardowns are surfaced', () => {
  const md = toMarkdown(
    buildReport([
      run({ task: 't1', ...failed, timed_out: true, agent_exit_code: null }),
      run({ task: 't1', rep: 2, agent_exit_code: 3, teardown_error: 'teardown exit 9' }),
    ]),
  );
  assert.match(md, /Runs stopped at the time budget: 1/);
  assert.match(md, /agent exited with an error code: 1/);
  assert.match(md, /1 run\(s\) had a failed teardown/);
});

test('an empty record set is an error, not an empty report', () => {
  assert.throws(() => buildReport([]), /No run records/);
});
