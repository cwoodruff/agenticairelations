import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const STAGES = new Set(['select', 'complete', 'operate']);

/** Load and validate every task under <suiteDir>/tasks/<id>/task.yaml. */
export async function loadSuite(suiteDir) {
  const root = path.resolve(suiteDir);
  const meta = parse(await readFile(path.join(root, 'suite.yaml'), 'utf8'));
  if (!meta?.id || !meta?.version) throw new Error('suite.yaml needs `id` and `version`.');
  const tasksDir = path.join(root, 'tasks');
  const tasks = [];
  for (const entry of (await readdir(tasksDir, { withFileTypes: true })).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(tasksDir, entry.name);
    const task = parse(await readFile(path.join(dir, 'task.yaml'), 'utf8'));
    tasks.push(validateTask(task, dir));
  }
  if (!tasks.length) throw new Error(`No tasks found in ${tasksDir}.`);
  return { root, id: meta.id, version: String(meta.version), platform: meta.platform ?? null, tasks };
}

export function validateTask(task, dir) {
  const where = `task in ${dir}`;
  for (const f of ['id', 'title', 'stage', 'prompt']) {
    if (!task?.[f]) throw new Error(`${where}: missing \`${f}\`.`);
  }
  if (!STAGES.has(task.stage)) throw new Error(`${where}: stage must be select, complete or operate.`);
  const graders = task.graders ?? [];
  if (task.stage === 'select') {
    if (!task.classify) throw new Error(`${where}: a select task needs \`classify\`.`);
  } else {
    if (!graders.some((g) => g.required)) throw new Error(`${where}: needs one or more required graders.`);
  }
  for (const g of graders) {
    if (!g.id || !g.run) throw new Error(`${where}: each grader needs \`id\` and \`run\`.`);
    if (g.timeout_seconds !== undefined && !(Number.isFinite(g.timeout_seconds) && g.timeout_seconds > 0)) {
      throw new Error(`${where}: grader ${g.id}: \`timeout_seconds\` must be a positive number.`);
    }
  }
  const budget = { max_minutes: 20, max_turns: null, ...(task.budget ?? {}) };
  // A zero, negative or missing time budget would let the agent run forever.
  if (!(Number.isFinite(budget.max_minutes) && budget.max_minutes > 0)) {
    throw new Error(`${where}: \`budget.max_minutes\` must be a positive number.`);
  }
  return {
    ...task,
    dir,
    graders,
    budget,
    interventions_allowed: task.interventions_allowed ?? 0,
  };
}
