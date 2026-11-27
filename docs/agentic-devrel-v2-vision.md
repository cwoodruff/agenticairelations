# Agentic Developer Relations v2: a revised vision

Companion to `agentic-devrel-critique.md`, which gives the evidence and the source list. Source IDs such as [S7] refer to that list, and its caveat applies here: most sources were checked from page excerpts, not opened in full.

Everything in this document is a proposal. Where a number is my recommendation and not a finding, it says so.

## 1. The vision in brief

Version 1 said: agents are a new audience, so DevRel should make agent-written integrations work on the first attempt, and measure that.

Version 2 says: **agents now choose, read, build on and operate platforms on behalf of developers. Agentic Developer Relations is the part of DevRel that finds out how well that goes, feeds what it learns back into the product and the public record, and protects the human community while doing so.**

Five shifts get from one to the other:

1. **From one moment to a journey.** First-attempt integration is one step. Agents also decide whether to use the platform at all, and increasingly operate it at runtime.
2. **From a headline metric to a small scorecard.** Success rate stays, joined by selection, cost, and the measured effect of each artifact.
3. **From assumed benefit to tested benefit.** Every recipe, skill, server or file has a stated purpose and evidence that it serves it.
4. **From claiming the territory to sharing it.** DevRel leads some of this work and contributes evidence to the rest.
5. **From two separately staffed layers to two closely linked ones.** What humans say in public probably influences what agents choose. That is a hypothesis this version sets out to test.

## 2. Name and positioning

**Recommendation: keep the name, and define it against Agent Experience.**

"Agent Experience (AX)" has been in use since January 2025 and appears in job titles [S15] [S16]. It names a property of a platform, as Developer Experience does. Developer Relations is the practice that, among other things, improves Developer Experience. The same relationship works one level down:

| | Property of the platform | Practice that works on it |
|---|---|---|
| Humans | Developer Experience (DX) | Developer Relations |
| Agents | Agent Experience (AX) | Agentic Developer Relations |

This keeps the name, the domain and the newsletter, places the framework inside a conversation that already exists, and removes the need to claim the whole field. It requires acknowledging AX explicitly and dropping "canonical". "Coined" can stay if it is limited to the phrase.

The alternative is to adopt "Agent Relations" or "AgentRel". I would not: the only sustained use I found was a vendor's [S25, relayed], and it drops the link to the book.

## 3. Definition

> **Agentic Developer Relations** is the practice within Developer Relations that represents developers who work through AI agents. It measures how well agents choose, understand, build on and operate a platform; turns what it finds into changes in the product, the documentation and the public record; and keeps the human community healthy as agent activity grows.

Three differences from version 1:

- It represents **developers who use agents**, not agents themselves. A person still approves the work and carries the consequences.
- It names **measurement and feedback** as the core, not the production of artifacts.
- It includes the **human community** in the definition, not as a separate layer.

## 4. The agent journey

Version 1 concentrates on stages 2 and 3.

| Stage | The question | Version 1 |
|---|---|---|
| **1. Select** | When a developer asks an agent for a solution, does it choose this platform, a competitor, or build its own? | Argued in the business case (agents run the proof of concept); not measured |
| **2. Understand** | Can the agent get correct, current context, cheaply? | Covered (docs, recipes) |
| **3. Complete** | Does it reach a working, verifiable integration? At what cost, and with how much human help? | Covered, as first attempt |
| **4. Operate** | Can an agent act on the platform at runtime, within limits its user has set? | Absent |
| **5. Report** | When something fails, does the company find out? | Surveys and log analysis; no direct channel |

**Stage 1** is the largest addition. In one study an agent built its own solution in 12 of 20 categories, and where it did pick a product it picked the same few [S10]. A platform that is never selected has no success rate to improve.

**Stage 4** is a different kind of problem and overlaps most with engineering. Serving an agent that acts for a user needs, at minimum: delegated and narrowly scoped credentials, spending and rate limits, the ability to revoke access, an audit trail, operations that are safe to repeat, and recovery from half-finished work. The aim is bounded and observable risk, not none. Whether to take this on now is a decision for you (section 14). If it is deferred, say so on the site.

**Stage 5** deserves a mechanism. **Proposal:** give agents a way to report failure, for example a feedback tool on the MCP server or CLI, or a documented endpoint that accepts a short structured report. This is untested. Reports must be treated as untrusted input: stripped of secrets and personal data, rate-limited against abuse, and never fed to another agent as instructions.

## 5. Principles

| # | Principle | Change from version 1 |
|---|---|---|
| 1 | **Two audiences, one platform, one accountable human.** Agents act; a developer answers for the result. Serve both. | Kept, with the human made explicit. |
| 2 | **Agents choose before they build.** Measure what they choose. The working hypothesis is that public docs, code and discussion influence it. | New. Extends "shaped by choice or neglect". |
| 3 | **Failures are silent until instrumented.** Agent traffic, evaluations and a reporting channel can make them visible. | Kept, with the remedy added. |
| 4 | **Give everything you publish for agents a purpose and a test.** Keep what serves its purpose, fix or remove what harms. | Replaces "encoded judgment is the moat". |
| 5 | **Make agent work easy to verify.** A person still has to check the result, and that checking can become the constraint. | New. |
| 6 | **Agent-facing content is a supply chain.** Review changes, record where content came from, and assume someone will try to poison it. | New. |
| 7 | **Do not tax the humans.** Agent programmes must not add load to maintainers or fill community spaces with generated content. | New. |

**On principle 4.** The evidence is mixed in a specific way. Vendors report large gains from the right artifact delivered the right way, and no gain from the same content delivered badly [S8] [S9]. Independent results are split [S22, relayed]: one benchmark reports a substantial average gain from curated skills, another almost none, and a study of repository context files found no general gain at higher cost. The practical rule is a paired test: run the evaluation with and without the artifact and publish the difference. Four outcomes are possible, and they call for different responses:

- **It helps.** Keep it.
- **No clear effect.** An inconclusive result is not proof of no benefit. Keep it if it is cheap; otherwise test again with a larger sample.
- **It is necessary whatever the average says.** A sign-in tool, a migration notice or a safety instruction earns its place by purpose. Test that it works, not that it lifts the score.
- **It harms** (lower success, higher cost). Fix or remove it.

Artifacts also interact, so test the combination that ships as well as each part. Judgment about what a correct integration looks like still matters. I expect it to last longest in the evaluation suite (the tasks and the graders), which does not depend on any one delivery format.

**On principle 5.** The Harvard study of Jellyfish data, as reported, found review time up 49% where agents were adopted [S6]. In the Stack Overflow survey, the most common answer on trust was reportedly "when I can easily verify the output" [S23, relayed]. Neither proves review is the binding constraint. Both suggest a platform helps its developers by making agent output checkable: test modes, dry runs, validators, clear success signals, and examples that include their own checks. Version 1 does not have this design goal, and DevRel is well placed to argue for it.

## 6. Measurement

### 6.1 The scorecard

FAISR is retained as one component and no longer stands alone. Version 1 leaves "attempt" undefined, so the terms need fixing first:

- A **run** is one developer request handed to one agent (a named model and harness), ending when the agent stops or a stated budget of time or turns runs out.
- Inside a run the agent may **retry on its own** as often as the budget allows.
- A **human intervention** is any further message or edit from the person.
- **FAISR** is then the share of runs that pass the graders with no human intervention. This is a proposed definition; the alternative, counting only the agent's first generated answer, is stricter and less like real use.

| Measure | What it answers | How |
|---|---|---|
| **Selection rate** | How often does an agent choose us for a neutral request in our category? How often does it build its own? | A fixed set of unbranded prompts per model and harness. Record first choice, alternatives, and build-your-own. |
| **Completion rate** | Does the agent reach a working integration? | Two figures: with no human intervention (FAISR), and with up to a stated number of interventions. State the grading rule. |
| **Cost** | What did it cost, including the failures? | Turns, tokens and wall-clock time per run across all runs, and total spend divided by successes. Reporting cost for successful runs only would hide expensive failures. |
| **Artifact lift** | Does this skill, server, file or docs change serve its purpose? | The same evaluation with and without it, paired by task. Report the difference and its interval. |
| **Agent reach** | Are agents arriving, and are they using what we publish? | Agent share of docs requests; how often a skill or tool is loaded when available. |
| **Outcome link** | Does any of this move adoption? | See below. |

**On the outcome link.** Comparing developers who arrive through an agent with those who do not is useful description, but the two groups differ in experience, task and fit, so it cannot show that better completion causes adoption. To test the claim, change one thing for part of the audience (a staged rollout of a docs change or a skill) and compare activation and retention across the two groups, stating what else differed. Until that is done, the link is a hypothesis.

Three guardrail measures sit beside these: load on maintainers (agent-opened issues and PRs, review time), security (agent-facing changes reviewed before release), and the existing human community measures.

### 6.2 Protocol rules

These are my recommendations, set so that the numbers can bear the weight put on them.

- **Report the sample and the interval.** As a guide to scale: if runs were independent, 20 runs at 50% would mean somewhere between about 30% and 70%, and 90 runs about 40% to 60%. Real runs are not independent, because they repeat the same tasks, so true uncertainty is wider when generalising to tasks outside the suite.
- **Say what the number generalises to.** A score describes this task suite on this model. Repetitions tell you how stable the agent is on those tasks. Only more, and more varied, tasks tell you about tasks you did not test.
- **Size the suite from a pilot.** Run a small pilot, look at how much results vary between repetitions and between tasks, then choose the number of tasks and repetitions needed to see the difference you care about. For artifact lift, compare with and without on the same tasks; how much data that needs depends on how often the two disagree. I would not start below about 30 tasks and three repetitions per model, and that is a judgment, not a derived figure. For reference, Stripe's published design is 69 scenarios with two repetitions per arm [S7].
- **Pin and name the model and harness.** Re-run on every model release. Report each model separately, and never pool across models without saying so.
- **Publish the grading rule.** Stripe's average falls from 78.1% to 29.4% when every necessary criterion must pass [S7]. Report strict and lenient figures.
- **Automate the graders.** Check created resources and test results. Human scoring every week does not scale and drifts.
- **Do not benchmark competitors on a private rubric.** If comparison matters, use a published task set others can run.
- **Run the suite on your own releases.** A docs or API change that lowers the score is a regression.

### 6.3 What is dropped

- **The Amdahl ceiling as a board metric.** See section 7.
- **The 70% and 40% overhead bands.** No basis.
- **API log signatures as a measurement method.** Keep as a hypothesis to test against known agent traffic. Signed agent identity [S26] and agent traffic analytics are better routes.
- **MCP adoption tier.** Replaced by section 8.
- **"Direct causal metric".** Replaced by the outcome link, to be shown, not asserted.

## 7. The bottleneck argument, corrected

The "Amdahl Tax" is the most quotable part of version 1 and the least accurate. I recommend retiring it as a pillar and keeping a corrected, smaller version.

**What can be said:**

- Jeff Dean, at GTC in March 2026, said that with agents working far faster than people, tool start-up time becomes "an Amdahl's Law-like bottleneck", and that an infinitely fast model yields "a factor of two or three" reduction in latency when tools are a large share of the work [S2]. Quote it exactly, with the condition.
- The arithmetic is: if tools take a share *s* of the time and are not sped up, the most a faster model can deliver is 1 / *s*. At 80% that is 1.25×. Turned around, fixing the tools is where the remaining gain is.
- Tool-time share is a useful **diagnostic** from evaluation traces. It tells engineering where an agent's time goes. It is not a maturity score. Two cautions: only part of tool time is avoidable overhead the platform controls, and where calls run in parallel the elapsed time, not the sum of durations, is what counts.

**What to add: there are two bottlenecks.**

1. **The environment**: slow tools, human-only sign-in, unclear errors. This is version 1's subject.
2. **Review**: a person has to check what the agent produced. One large study, which I have only from a news report, found review load rising sharply where agents were adopted [S6].

Which of the two limits a given team is an empirical question. A platform reduces the first by being fast and clear for agents, and the second by being easy to verify. Version 2 covers both.

**What to stop saying:** that the METR study shows the environment is the constraint, and that the Jellyfish figures describe companies that rebuilt their toolchains. Neither source says so. The productivity evidence is unsettled [S3], and the framework does not need it.

## 8. What to build: a portfolio judged by effect

Version 1 offers a recipe library and a three-step MCP ladder. Since April the options have multiplied and the standards have moved into shared governance [S17]. Version 2 stays neutral on format.

**Order of work**, from most to least durable:

1. **The product surface.** API design, error messages that name the fix, sign-in that works without a browser, a CLI, a sandbox or test mode. No document compensates for a poor surface.
2. **One source of truth for documentation**, delivered as clean markdown as well as HTML, versioned, with deprecations marked.
3. **The evaluation suite.** Tasks, graders and results. Publish it where possible. This is the asset that encodes what "correct" means.
4. **Short, always-available guidance.** A brief index or instruction block that agents reliably see. In Vercel's test this outperformed an on-demand skill [S8].
5. **On-demand packages.** Skills and plugins for specific workflows. Check that they load: one of Supabase's did so in about one session in ten until its description was rewritten [S9].
6. **Tools.** An MCP server, where an agent needs authenticated access to a live system. Watch the context cost of tool definitions.

"Prompt recipes" from version 1 fold into items 4 and 5.

**Maturity**, defined by what the organisation knows and does, not by what it has shipped:

| Level | Name | Test |
|---|---|---|
| 0 | Blind | No measurement of agent behaviour. |
| 1 | Measured | An evaluation suite exists and has been run across more than one model. Agent traffic is visible. |
| 2 | Served | Agent-facing artifacts exist, each with a stated purpose and a test result. |
| 3 | Gated | The suite runs on releases; regressions block or flag. Results are tracked per model version. Agent-facing changes get security review. |
| 4 | Native | The product has been changed for agents: sign-in, errors, limits, sandbox, identity, a failure-reporting channel. |

## 9. Who does the work

Version 1 names three new DevRel roles. I found no adoption of the titles elsewhere, and two describe work that commonly has another owner. Version 2 describes responsibilities and proposes who leads. Companies are organised differently, so treat the table as a starting allocation to adapt.

| Responsibility | Leads | Contributes |
|---|---|---|
| The task list: what developers ask agents to do with the platform | **DevRel** | Support, Product |
| Evaluation suite and graders | **DevRel**, or an Agent Experience team where one exists | Platform engineering |
| Selection monitoring, and the public record that may influence it | **DevRel** | Marketing |
| Feedback into the roadmap | **DevRel** brings evidence; Product decides | Platform engineering |
| Community and maintainer policy on agent contributions | **DevRel** | Open-source office, Legal |
| Relationships with the companies that build agents and models | **DevRel** | Partnerships |
| Documentation source of truth and machine delivery | Docs | DevRel |
| Skills, plugins and instruction files | Docs and DevRel jointly | Platform engineering |
| API errors, sign-in, limits, sandbox, CLI, MCP server | Platform engineering | DevRel (evidence from evaluations) |
| Agent traffic analytics and attribution | Growth or data | Docs |
| Security review and provenance of agent-facing content | Security | All publishers |

**DevRel's distinct contribution** is fourfold: it knows what developers are trying to do, it can judge whether a result is good, it already carries feedback to product, and it holds the relationships with the community and, now, with agent vendors.

**The version 1 roles map as follows:**

- *Agent Champion* becomes the DevRel lead for agent experience: owner of the task list, the evaluation suite and the feedback loop. Use whatever title the company's ladder allows; "Developer Advocate, Agent Experience" is closer to the market than a new noun.
- *Documentation Architect* becomes a docs team responsibility.
- *API Experience Designer* becomes a platform engineering or Agent Experience team responsibility.

**Staffing triggers** should come from the company's own data, not a general adoption figure: the agent share of docs traffic, the share of signups that arrive through an agent, and the gap the first evaluation run reveals. The "one person, one day a week" starting point from version 1 stays.

## 10. The human layer

Version 1's view that human work gains value is plausible, though I found no data either way. Its diagram already shows feedback between the layers, and its budget floors for community work are worth keeping. What changes is the staffing rule that the two layers cannot be served by the same practitioners at full load: version 2 expects the people doing each kind of work to sit close together, and often to be the same people. Three points:

- **The layers are probably linked through selection.** Models are trained on, and agents retrieve, what people write in public. If that influences what agents choose, then honest posts, talks, answers and comparisons from real developers are upstream of stage 1. This is a hypothesis. Tracking selection rate beside community activity is a first look, but model releases and product changes move both, so it will not settle cause. A stronger test is to compare selection before and after a specific body of public content appears, model version held fixed, for agents that search the web.
- **A commitment against generated filler.** Content published under the programme's name is written or closely edited by a person who can stand behind it. State the policy.
- **A commons rule.** No programme should reward agent-generated issues or pull requests to third-party projects. Hackathons and contributor programmes follow the target project's AI policy and require disclosure. Maintainers are already closing their doors [S20].

## 11. The patterns, re-examined

Version 1 sorts the patterns into three boxes, and its list does not match the book's (critique, section 3.5). Version 2 asks two independent questions of each pattern:

- **Read:** does the pattern produce something agents read or use?
- **Join:** can an agent take part in the activity itself?

A pattern can be yes on both, one or neither. The list follows the book's chapter titles [S21]. I have the titles only, not the text, so every row needs the authors' correction, and "what changes" is a proposal, not a finding.

| Pattern | Read | Join | What changes |
|---|---|---|---|
| Reference Documentation | Yes | No | The source of truth. Markdown delivery, explicit errors and deprecations. |
| SDK | Yes | Yes | Agents call it as well as read it. Typed interfaces, errors that name the remedy, a CLI alongside. |
| Sample/Example | Yes | No | Complete, runnable, tested on every release. The raw material for evaluations. |
| Guide | Yes | No | Still for people. Date and version it; retire stale guides. |
| Tutorial | Yes | No | As Guide. |
| Article | Yes | No | The place for judgment and opinion in a named voice. |
| Blog Post | Yes | No | As Article. |
| Book | Yes | No | As Article, where the text is available to models. |
| Case Study | Yes | No | Evidence for a person, and for an agent asked to compare options. |
| Recorded Video | Yes, with a transcript | No | Publish transcripts. |
| Podcast | Yes, with a transcript | No | Publish transcripts. |
| Webinar | Yes, with a transcript | No | Publish transcripts and slides. |
| Conference Session | Yes, if recorded | No | The talk is human; the recording, slides and code join the public record. |
| Live Streaming | Yes, if recorded | No | Real-time and unscripted is the point; the recording can still be read. |
| Newsletter | Possibly | No | Human reach first. Whether agents read it depends on where it is published. |
| Social Media | Possibly | No | As Newsletter. |
| Forums | Yes | Possibly | Answers become part of the record. Decide and state whether agent-written posts are allowed. |
| Technical Support | Yes | Yes | Agents ask as well as people. Also the place to learn what the agent got wrong. |
| Open-Source Project | Yes | Yes | Needs an explicit policy on agent contributions. |
| Product/Service Development | No | Yes | The core loop. Evaluation failures become product changes. Missing from version 1. |
| Customer Pre-Sale | No | Yes | The buyer's agent may run the proof of concept. Be ready for it. |
| Code Review | No | Yes | Reviewing agent-written integrations, where checking effort lands. |
| Hackathon | No | Yes | Teams build with agents. Judge what was verified, not how much was produced. Collect failure reports. |
| Workshop | No | Yes | Teach directing and checking an agent on this platform. |
| Training | No | Yes | As Workshop. |
| Office Hours | No | Yes | "Bring the transcript": diagnose what the agent did. |
| Live Playground | No | Only if built for it | A page for people is not a sandbox for agents. That needs programmatic access, isolation and reset. |
| Survey | No | No | Research with people. Ask how they use agents with the platform; this feeds the task list. |
| Customer Check-In | No | No | Add a question: what are your agents struggling with? |
| Ambassadors | No | No | Remain external people, not a staff role. They may contribute to evaluations and skills. |
| Partnerships | No | No | A new partner type: the companies that build agents and models. |
| Conference | No | No | Presence and trust. Unchanged. |
| Booth | No | No | As Conference. |
| Party | No | No | As Conference. |
| User Group Network | No | No | As Conference. |
| Sponsorship | No | No | I see no agent dimension. Version 1's claim that it "grows more valuable" needs evidence. |
| Swag | No | No | As Sponsorship. |

## 12. Version 1 to version 2 at a glance

| Version 1 | Version 2 | Why |
|---|---|---|
| "Canonical"; no mention of AX | DevRel's contribution to Agent Experience | AX predates it and is in use |
| One audience added: coding assistants writing integrations | Five-stage journey, including selection and runtime | Agents choose and operate, not only integrate |
| FAISR as the headline, "attempt" undefined | Scorecard of six measures; FAISR defined and kept as one | Agents iterate; small samples; no shown link to adoption |
| Amdahl Tax as a pillar | A corrected diagnostic, plus the review bottleneck | Source misquoted; arithmetic inverted |
| METR and Jellyfish as proof | Not used as proof | Neither says what was claimed |
| Encoded judgment is the moat | A purpose and a test for everything | Mixed evidence on artifacts |
| Recipe library | Evaluation suite first; artifacts tested | The suite does not depend on a delivery format |
| MCP tiers | Format-neutral portfolio; maturity by practice | Skills, AGENTS.md, CLIs; MCP redesigned |
| Three new DevRel roles | Responsibilities with a proposed lead for each | No uptake found; two commonly have another owner |
| 20% and 40% triggers | Triggers from the company's own data | No basis; not measurable as stated |
| Two layers, not served by the same practitioners at full load | Two linked layers, worked by one team; budget floors kept | Public human discussion may influence agent choice; to be tested |
| Three pattern buckets | Two independent questions per pattern, on the book's actual list | Mismatch and contradictions |
| Selection argued but not measured | Selection rate, on unbranded prompts | Agents choose, and often build their own |
| (absent) | Security, maintainer protection, verifiability, a direct failure-reporting channel | Developments since April |

## 13. Roadmap

Ordered by priority. No dates.

**First: restore credibility.** These are corrections, and everything else depends on them.

1. Correct the Dean quotation and remove "47×".
2. Fix the Amdahl arithmetic wherever it appears, including the two diagrams.
3. Remove the METR and Jellyfish interpretations; cite the 2026 METR update.
4. Add a source link for every statistic. Remove any that cannot be sourced.
5. Correct the pattern list against the book.
6. Drop "canonical"; limit "coined" to the phrase; add a section on Agent Experience and how this relates to it.
7. State commercial interests (advisory work, EcoSynt) plainly beside the metric they relate to.

**Second: publish version 2.**

8. The definition, journey and principles (sections 3 to 5).
9. The measurement specification, as an open document others can adopt and criticise (section 6).
10. The portfolio and maturity levels (section 8).
11. The responsibility table (section 9).
12. The re-examined patterns, checked against the book's text and ideally reviewed by the co-authors (section 11).

**Third: earn adoption.**

13. Run the measurement specification on two or three public platforms and publish the method, the data and the limits. One worked example will persuade more than any page of argument.
14. Release the task format and graders openly, separate from any commercial offer, so the metric is not proprietary.
15. Invite named practitioners, including people who work under the AX label, to critique it, and publish the responses.
16. Find one or two teams willing to be written up, including what did not work.
17. Apply the framework to the site itself: markdown versions of each page, working source links, and a note on how agents use it.

## 14. Decisions for you

1. **Name.** Keep "Agentic Developer Relations" positioned under AX (my recommendation), or adopt a different term.
2. **FAISR.** Keep the name for first-attempt completion inside the scorecard (my recommendation, since it is already published), or retire it.
3. **Amdahl.** Retire as a pillar and keep the corrected diagnostic (my recommendation), or drop it entirely.
4. **Openness.** Whether to publish the measurement specification under an open licence, separate from any advisory or product work. I think the framework's credibility depends on it.
5. **Co-authors.** Whether to involve the book's other authors in the pattern mapping.
6. **Runtime agents.** Whether stage 4 (agents operating the product) is in scope now, or noted and deferred. It widens the audience beyond coding tools and overlaps most with engineering.

## 15. What would show version 2 is wrong

- **Agents stop needing help.** If artifact lift trends to zero across models, stages 2 and 3 shrink to keeping documentation accurate, and the work that remains is selection, verification and product feedback. Tracking lift over time will show this.
- **Selection turns out not to be influenceable.** If choices are fixed by training data that no one outside the model companies can affect, stage 1 becomes a relationship with a few vendors and little else.
- **The outcome link does not appear.** If better completion rates do not show up in activation or retention, the case for investment weakens and should be restated honestly.
- **Engineering absorbs it.** If Agent Experience teams become standard, DevRel's share narrows to the task list, the community and the feedback loop. Section 9 is written so that this is a smaller role, not a failed one.
