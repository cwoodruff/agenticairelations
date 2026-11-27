# Reference harness

A small runner and report generator for the [Agentic Developer Relations measurement specification](../docs/measurement-specification.md). It runs a suite of tasks against one or more coding agents and reports selection rate, completion rate (FAISR), cost and artifact lift, each with an interval.

**What this is not.** It has been tested only against a mock agent that copies reference answers at random. It has not been used on a real platform with a real agent. The example suite is for a fictional SDK and measures nothing. Treat the harness as a starting point to adapt.

License: MIT, like the rest of the site source.

## Try it

Requires Node 20 or later and a POSIX shell.

```bash
npm install
npm run harness:demo   # runs the example suite against the mock agent and prints a report
npm test               # the harness's own tests
```

## Run it on your platform

1. **Write a suite.** Copy `examples/suite` and replace the tasks. The layout is:

   ```
   my-suite/
   ├── suite.yaml              id, version, and the platform's selection label
   ├── tasks/
   │   └── <task-id>/
   │       ├── task.yaml       the definition (specification, section 4)
   │       ├── starting_state/ copied fresh into a new directory for every run
   │       └── graders/        scripts that exit 0 for pass
   └── artifacts/<name>/       optional: files to test with and without
   ```

2. **Describe your agents.** Copy `examples/agents.example.json`. Each agent needs an `id`, the `model`, the `harness` (the coding tool), its `version`, the `permission_mode` it ran in, and a `command` array that runs the tool without a person present. In the command, `{prompt_file}` is replaced with the path of a file holding the prompt, and `{prompt}` with the prompt text.

3. **Run and report.**

   ```bash
   node harness/run.mjs --suite my-suite --agents my-agents.json --reps 3 --out results/runs.jsonl
   node harness/report.mjs --in results/runs.jsonl --platform <label> --md results/report.md
   ```

   Add `--artifact my-suite/artifacts/<name>` to run every task twice, without and with those files copied into the working directory, and get artifact lift paired by task.

## How a run works

For each agent, task, arm and repetition the runner:

1. creates a new empty directory and copies `starting_state` into it;
2. copies the artifact in, if this is the "with" arm;
3. runs the task's `setup` command, if any;
4. starts the agent as a new process in that directory, and stops it if `budget.max_minutes` passes;
5. runs each grader in the directory (or the `classify` command, for a selection task);
6. runs `teardown`, deletes the directory, and appends one JSON record to the output file.

Nothing carries over between runs. If your tasks create resources on the platform itself, such as test accounts, create and remove them in `setup` and `teardown`.

Commands receive these environment variables:

| Variable | Meaning |
|---|---|
| `ADR_TASK_DIR` | The task's directory in the suite (graders and reference files live here). |
| `ADR_WORKDIR` | The run's working directory. Commands also start in it. |
| `ADR_PROMPT_FILE` | A file containing the prompt. |
| `ADR_AGENT_OUTPUT_FILE` | The agent's standard output, for classifiers. |
| `ADR_METRICS_FILE` | Where the agent or a wrapper may write `{"turns": n, "tokens": n, "cost_usd": n}`. |
| `ADR_MAX_TURNS` | The task's turn budget, for agents that can enforce one. |

## Limits

- **Interventions.** Runs are unattended, so every run has zero human interventions and the completion figure is FAISR. Assisted completion (the specification's *k* greater than zero) is not supported.
- **Turns and tokens.** The runner measures wall-clock time itself. Turns, tokens and money are recorded only if the agent, or a wrapper script around it, writes them to `ADR_METRICS_FILE`. Otherwise the report says "not reported".
- **Turn budgets.** Only the time budget is enforced. `max_turns` is passed to the agent and not checked.
- **Intervals.** Rates carry 95% Wilson intervals that treat runs as independent. Runs repeat the same tasks, so real uncertainty is wider. Artifact lift uses the task as the unit, with a normal approximation that is rough below about ten tasks.
- **Graders run your code.** Graders, classifiers and agents execute with your permissions. Run suites you trust, and run agents in a container or a throwaway machine.
- **Not covered.** Agent reach, the outcome link, the stage 4 measures and the guardrails need data from outside an evaluation run.
- **Platforms.** Linux and macOS. Not tested on Windows.
