# Agentic Developer Relations measurement specification

Version 0.2 (draft), 27 November 2026. Author: Chris Woodruff.

This document defines how to measure how well AI agents fare on a developer platform. It is the method behind the [measurement page](https://agenticairelations.com/measurement/) of agenticairelations.com, written so that anyone can apply it and compare results.

**Status.** This is a draft. It has not yet been run on a real platform with a real agent, and the stage 4 measures in section 7 are untested proposals. A reference harness in [`harness/`](../harness/) covers selection rate, FAISR, cost and artifact lift for unattended runs. It does not cover assisted completion, agent reach, the outcome link, or section 7, and it has been exercised only against a mock agent. Corrections and criticism are welcome through issues on this repository.

**Changes in 0.2.** Completion is binary, and partial credit is a separate diagnostic (3.2). Every run must start from a restored state with a fresh agent session (section 5). The task format gains `setup`, `teardown` and `classify`.

**License.** This specification is licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/). You may use, adapt and redistribute it, including commercially, provided you give credit. The rest of this repository is licensed separately; see the README.

The words MUST, SHOULD and MAY are used as requirement levels.

## 1. Scope

The specification covers agents that act for a developer or user in relation to a platform (an API, SDK, service or tool). It follows the five stages of the agent journey:

| Stage | Question | Measures |
|---|---|---|
| Select | Does the agent choose the platform? | Selection rate |
| Understand | Can it get correct, current context? | Agent reach, artifact lift |
| Complete | Does it reach a working integration? | Completion rate, cost |
| Operate | Can it act at runtime within set limits? | Section 7 (proposed) |
| Report | Does the company learn of failures? | None yet |

## 2. Terms

- **Agent.** A named model together with a named harness (the tool that runs it), each with a version.
- **Task.** One realistic developer request, with a fixed prompt and graders.
- **Run.** One task handed to one agent. A run ends when the agent stops, or when a stated budget of time or turns is exhausted.
- **Autonomous retry.** Any further attempt the agent makes inside a run without input from a person. Retries are allowed up to the budget.
- **Human intervention.** Any further message or edit from a person after the initial prompt. Routine permission prompts from the harness (approving a command or a file write) are not interventions, but the permission mode MUST be reported, since it changes how much a person is involved.
- **Grader.** An automated check that returns pass or fail for one criterion.
- **Artifact.** Anything published to help agents: a documentation change, an instruction file, a skill, a plugin, a tool server.

## 3. Measures

### 3.1 Selection rate

For a fixed set of prompts that describe a need in the platform's category without naming any product, the share of runs in which the agent's first choice is the platform.

Reports MUST also give the share of runs in which the agent built its own solution, and SHOULD list the alternatives chosen.

### 3.2 Completion rate

Completion is binary. A run **passes** if every grader marked `required` passes within the budget, and fails otherwise. Two figures MUST be reported:

- **FAISR (First-Attempt Integration Success Rate):** the share of runs that pass with no human intervention.
- **Assisted completion:** the share that pass with at most *k* human interventions, with *k* stated.

Reports MAY also give **partial credit**: for each run, the share of required graders that passed, averaged over all runs. Partial credit is a diagnostic that shows how close failing runs came. It MUST NOT be called a completion rate, and MUST NOT be used as the count of successes for cost.

Graders not marked `required` do not affect completion. Their pass rates SHOULD be reported one by one.

### 3.3 Cost

For all runs, including failures: turns, tokens, and wall-clock time per run. Reports MUST also give total cost divided by the number of successful runs. Reporting cost for successful runs only is not permitted, because it hides expensive failures.

Where traces allow, reports MAY give **tool-time share**: the fraction of elapsed time spent in tool calls. This is a diagnostic for locating delay. It is not a score, since part of tool time is necessary work or outside the platform's control.

### 3.4 Artifact lift

The difference in a stated measure between runs with an artifact and runs without it, on the same tasks and the same agent.

- Each artifact MUST have a stated purpose, and lift MUST be measured on the measure that matches that purpose. An artifact meant to reduce cost is judged on cost.
- Comparisons MUST be paired by task.
- Reports MUST give the difference with an interval, and MUST NOT describe an inconclusive result as no effect.
- Where several artifacts ship together, the combination SHOULD be tested as well as each part.

### 3.5 Agent reach

- The share of documentation requests that come from agents, with the method of identifying agents stated.
- For each skill or tool, the share of runs in which it was loaded when available.

### 3.6 Outcome link

Whether changes in the measures above are followed by changes in adoption.

A comparison of developers who arrive through an agent with those who do not MAY be reported as description. It MUST NOT be presented as evidence of cause. A causal claim requires a staged change applied to part of the audience, with activation and retention compared between groups and other differences stated.

## 4. Task format

A task is a directory containing a definition file and graders. The definition SHOULD carry at least these fields:

```yaml
id: create-checkout-session
title: Create a hosted checkout for a one-time payment
stage: complete            # select | complete | operate
prompt: |
  Add a checkout page to this app so a customer can buy one item.
starting_state: repos/starter-node   # code the agent begins with, copied fresh for each run
setup: scripts/create_test_account.sh     # optional: prepare state outside the directory
teardown: scripts/delete_test_account.sh  # optional: remove it afterwards
budget:
  max_turns: 60
  max_minutes: 20
interventions_allowed: 0   # k, for assisted completion
graders:
  - id: builds
    required: true
    run: sh "$ADR_TASK_DIR/graders/build.sh"
  - id: session-created
    required: true
    run: python3 "$ADR_TASK_DIR/graders/check_session.py"
  - id: handles-declined-card
    required: false
    run: python3 "$ADR_TASK_DIR/graders/check_decline.py"
source: support-tickets-2026-q3   # why this task is in the suite
```

A grader is a command that exits with zero for pass. A grader that does not finish within its time limit counts as a fail. The paths above follow the reference harness, which runs graders in the run's working directory and gives the task's own directory as `ADR_TASK_DIR`.

A selection task has no graders. It carries a `classify` command that reads the agent's answer and prints one label for its first choice: the platform's label, `build-own`, or another product's name. Classifiers SHOULD be spot-checked against labels assigned by hand.

Prompts SHOULD be what a reasonably competent developer would type, not an optimised prompt. Selection tasks MUST NOT name the platform or its competitors.

## 5. Protocol

1. **Name the agent.** Every result MUST state the model, the harness and their versions. Results for different agents MUST be reported separately and MUST NOT be pooled without saying so.
2. **Repeat.** Each task MUST be run more than once per agent, since results vary between runs.
3. **Isolate.** Every run MUST begin from the task's starting state, restored afresh, with a new agent session that has no memory of earlier runs. This applies to code, to files, and to resources on the platform such as test accounts. It applies to each arm of an artifact comparison, so that nothing produced with the artifact is visible to a run without it.
4. **Size from a pilot.** The number of tasks and repetitions SHOULD be chosen after a pilot that shows how much results vary between repetitions and between tasks. As a starting point, 30 tasks and three repetitions per agent is suggested; this is a judgment, not a derived figure.
5. **Report uncertainty.** Every rate MUST be given with the number of runs and an interval. Reports SHOULD state that runs on the same task are not independent, and that the result describes the suite, not all possible tasks.
6. **Automate grading.** Graders SHOULD inspect outcomes (resources created, tests passed) and SHOULD NOT rely on a person's scoring.
7. **Re-run.** The suite SHOULD be run on each platform release and each new model version. A release that lowers a score is a regression.
8. **Comparing platforms.** Comparisons between platforms MUST use a published task set that others can run.

## 6. Reporting

A report MUST include, for each agent: the date, the suite version, the number of tasks and repetitions, each measure with its interval, the grading rule, the budget, the harness's permission mode, and the value of *k*. It SHOULD include the tasks and graders themselves, or say why they are withheld.

## 7. Agents that operate the product (proposed)

These measures cover an agent acting on a platform at runtime for a user. They are proposals and have not been tested.

| Measure | Definition |
|---|---|
| Delegated task completion | Of tasks attempted within the scope the user granted, the share completed correctly. |
| Out-of-scope attempts | The number of attempted actions outside granted scope or limits, and the share refused and logged. The target for the second figure is all of them. |
| Recovery rate | After an interrupted or failed operation, the share of cases in which the account is left in a known, correct state. |
| Approvals requested | How often the agent stops to ask a person, by reason. |

A platform reporting these SHOULD also state which controls it provides: scoped delegated credentials, spending and rate limits, revocation, an audit trail, operations that are safe to repeat, and recovery from partial completion.

## 8. Guardrails

Reports SHOULD track alongside the measures:

- **Maintainer load:** agent-opened issues and pull requests on the platform's open-source projects, and time spent reviewing them.
- **Security:** whether each change to agent-facing content was reviewed before release.
- **Human community health:** the platform's existing community measures.

## 9. Known limitations

- A suite reflects the tasks its authors thought of. It can miss what developers actually ask.
- Agents change quickly. A result is a snapshot of one model version.
- Selection is sensitive to prompt wording. Small changes can move the result.
- Identifying agent traffic depends on agents declaring themselves, which not all do.
- The link from these measures to adoption is a hypothesis.
