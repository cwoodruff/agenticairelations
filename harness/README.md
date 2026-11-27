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

2. **Describe your agents.** Copy `examples/agents.example.json`. Each agent needs an `id`, the `model`, the `harness` (the coding tool), its `version`, the `permission_mode` it ran in, and a `command` array that runs the tool without a person present. All five descriptive fields are required. In the command, `{prompt_file}` is replaced with the path of a file holding the prompt, and `{prompt}` with the prompt text.

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
4. starts the agent as a new process in that directory, with a new empty home directory, and kills it and everything it started if `budget.max_minutes` passes;
5. runs each grader in the directory (or the `classify` command, for a selection task);
6. runs `teardown`, deletes the directories, and appends one JSON record to the output file.

The working directory, the home directory and the agent process are new for every run, so files, tool history and memory files do not carry over. The harness cannot reset anything outside those: if your tasks create resources on the platform itself, such as test accounts, create and remove them in `setup` and `teardown`.

**Credentials.** Because the home directory is empty, an agent that keeps its login there will not be signed in. Pass credentials through environment variables. If that is impossible, set `"share_home": true` for the agent; the report then states that session isolation was not enforced.

**Errors are not failures.** If the agent cannot be started, `setup` fails, or a grader or classifier cannot be run at all, the run is recorded with an `error`. The report lists these runs and leaves them out of every figure. A failed `teardown` is counted and flagged, since later runs may have seen leftover state. An agent that starts but exits with an error code is graded normally, and the report says how many did. A grader that times out counts as a failed check, because the usual cause is agent-written code that never returns; the report says how many runs this affected. Graders get 300 seconds unless the grader sets `timeout_seconds`.

`teardown` runs after every run that got as far as setup, including tasks that have a `teardown` and no `setup`.

Environment variables:

| Variable | Given to | Meaning |
|---|---|---|
| `ADR_WORKDIR` | agent and graders | The run's working directory. Commands also start in it. |
| `ADR_PROMPT_FILE` | agent and graders | A file containing the prompt. |
| `ADR_METRICS_FILE` | agent and graders | Where the agent or a wrapper may write `{"turns": n, "tokens": n, "cost_usd": n}`. |
| `ADR_MAX_TURNS` | agent and graders | The task's turn budget, for agents that can enforce one. |
| `ADR_TASK_DIR` | graders only | The task's directory in the suite, where graders live. |
| `ADR_AGENT_OUTPUT_FILE` | graders only | The agent's standard output, for classifiers. |

**Keep the suite away from the agent.** The agent is not told where the graders are, but the harness does not sandbox it, and an agent that explores the disk could find them. For results you intend to rely on, run the agent in a container or under a user account that cannot read the suite directory. (The bundled mock agent is deliberately handed the suite path so that it can copy reference answers.)

## Limits

- **Interventions.** Runs are unattended, so every run has zero human interventions and the completion figure is FAISR. Assisted completion (the specification's *k* greater than zero) is not supported.
- **Turns and tokens.** The runner measures wall-clock time itself. Turns, tokens and money are recorded only if the agent, or a wrapper script around it, writes them to `ADR_METRICS_FILE`. Otherwise the report says "not reported".
- **Turn budgets.** Only the time budget is enforced, and `budget.max_minutes` must be a positive number. `max_turns` is passed to the agent and not checked.
- **Intervals.** Rates carry 95% Wilson intervals that treat runs as independent. Runs repeat the same tasks, so real uncertainty is wider. Cost figures are means with no interval. Artifact lift uses the task as the unit with a t interval, and gives no interval for fewer than three tasks or when every task shows the same difference.
- **Artifact lift.** Reported on completion, wall-clock time and tokens. Judge an artifact on the one that matches its purpose. Lift on selection rate is not computed; compare the two arms' selection figures.
- **Specification coverage.** The harness covers selection rate, FAISR, cost and artifact lift, and prints the run details section 6 of the specification asks for. It warns, but does not stop, if you ask for a single repetition.
- **Everything runs with your permissions.** Graders, classifiers, setup scripts and agents execute as you, with your environment variables. Run suites you trust, and run agents in a container or a throwaway machine.
- **Not covered.** Agent reach, the outcome link, the stage 4 measures and the guardrails need data from outside an evaluation run.
- **Platforms.** Linux and macOS. Not tested on Windows.
