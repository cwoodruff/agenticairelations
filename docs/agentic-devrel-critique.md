# Agentic Developer Relations: a critical review

Reviewed: `cwoodruff/agenticairelations` at commit `9522c18` (all pages, the three essays, the site plan and the framework document). Review date: 27 November 2026. The framework's substance dates from April 2026; the July commits only renamed the site.

Companion document: `agentic-devrel-v2-vision.md`.

## 1. Verdict

The central observation is right and has aged well: platforms now have a second audience, AI agents, whose failures do not show up in the usual DevRel dashboards. The advice to run a small set of integration tasks through coding agents and score the results is also sound, and several vendors now do exactly that in public.

The argument built around that observation does not hold up as written:

- **The evidence is misreported.** The three statistics the site leans on (Jeff Dean, METR, Jellyfish) each say something different from what the site claims, and the Amdahl arithmetic is inverted. The site links to no source for any statistic.
- **The headline metric is too narrow and too noisy.** First-attempt success measures one moment in a process that is now iterative, the recommended sample cannot detect the improvements the site promises, and the claimed link to adoption is asserted, not shown.
- **The scope misses where the debate went.** Security, agent traffic and identity, open-source maintainer load, and whether curated artifacts help are absent. Whether an agent chooses the platform, and who owns the work, are touched on but not developed.
- **The positioning is exposed.** "Agent Experience (AX)" predates the site by over a year and appears in job titles. In my searches I found no third-party use of "Agentic Developer Relations", FAISR, or the three role names.

None of this is fatal. The fixes are mostly a matter of narrowing claims, citing sources and widening scope. Section 3 lists the problems in order of severity; section 5 audits each claim.

## 2. How this review was done, and its limits

I read the whole repository, then researched what has been published since April 2026.

**One limit matters.** The environment I worked in could reach GitHub and nothing else, so I could not open most primary sources. For those, I relied on text excerpts of the page returned by a search tool. Excerpts are usually verbatim, but I could not check full context, authorship or exact dates. Every source in section 7 carries a grade:

| Grade | Meaning |
|---|---|
| **D** | Read directly (the repository, or files hosted on GitHub), in full unless the source table says otherwise. |
| **E** | I saw an excerpt of the page text; the page itself was not opened. |
| **R** | An excerpt relayed by a research sub-agent; I did not see it myself. |

Flags: *vendor* (the publisher sells something related), *secondary* (a report about the source, not the source).

Before any of this is published, the E and R sources should be opened and checked. Section 6 lists what I could not find at all.

## 3. What does not hold up

### 3.1 The evidence base

**Jeff Dean did not say what the site says he said.** The site states that "making a model infinitely fast would yield only a 2–3× end-to-end improvement in a typical software development task. The other 47× is eaten by the environment." The reported quote [S2] is:

> "In this world where you have an agent that is operating 50 times faster than a human, the startup time of all your tools, I think, is going to start to be an Amdahl's Law-like bottleneck… 'Cause if you make your model infinitely fast, you are going to get — depending on what you're doing — a factor of two or three end reduction in latency if your tools are a pretty significant fraction of what you're doing."

Three differences:

- It is about **latency**, and specifically tool start-up time, not software development productivity.
- It is **conditional** ("depending on what you're doing", "if your tools are a pretty significant fraction").
- **"47×" is not in the quote.** It appears to be 50 minus 3. Those two numbers measure different things (agent speed relative to a human; latency reduction from a faster model) and cannot be subtracted.

**The Amdahl arithmetic is inverted.** The site says that if 80% of integration time is tool interaction, "your theoretical ceiling is 5× improvement regardless of how capable the model becomes" (definition page, essay, and two diagrams). Under Amdahl's Law, if the model's 20% share becomes instant and the 80% is untouched, the maximum speedup is 1 / 0.8 = **1.25×**. A 5× ceiling corresponds to a 20% tool share. Dean's "two or three" corresponds to a tool share of roughly a third to a half.

The corrected figure helps the argument. Up to 5× is what could be gained by removing the 80%, in the ideal limit where all of it disappears and nothing else changes. That is the case the site wants to make. It is just not a ceiling on model improvement, and real gains will be smaller, since some tool time is necessary work or outside the platform's control.

**The METR study is over-read, and has been updated.** The site reports the 2025 result accurately (16 developers, 19% slower, believed they were about 20% faster [S4]) and then concludes: "The model wasn't the variable. The environment was." The study did not vary the environment, so it cannot support that. It compared the same developers with and without AI on their own repositories. The site also says the result "persisted after controlling for task type, tool choice, and developer experience"; I could not confirm that wording.

In February 2026 METR published a follow-up [S3]. For returning developers the estimate was 18% *less* time (interval from 38% less to 9% more); for new recruits 4% less (15% less to 9% more). METR says it believes developers are now more sped up than in early 2025, and also that selection effects make its new data "only very weak evidence" for the size of the change. The honest summary is that the evidence is unsettled, not that it shows a slowdown caused by the environment.

**The Jellyfish figure describes something else.** The site says that "at companies that had invested in rebuilding their internal toolchains for agent-speed consumption, the same generation of AI tools drove pull requests per engineer from 1.36 to 2.9." The source [S5] is an August 2025 Jellyfish post, and the sentence is: "going from 0% AI adoption to 100% adoption corresponds to an increase from 1.36 PRs per engineer on average to 2.90 PRs." That is a cross-company association between how much engineers use AI and how many PRs they merge. The excerpt says nothing about rebuilt toolchains. The site plan notes that the Amdahl page was "derived from Nate's summary", so the figures may have reached the site second-hand; I could not trace that summary.

So the site's key contrast (METR in "unoptimised" environments, Jellyfish in "optimised" ones) is not in either source.

**A second constraint is not developed.** A Harvard study of Jellyfish data, as reported by InfoQ [S6], found that agents raised lines of code by 30% but resolved issues by 12%, while PR review time rose 49% and the share of PRs needing changes doubled. I have this from a news report, not the paper, and longer reviews do not prove that review is what limits throughput. It does suggest that **human review** can become a constraint alongside the vendor's docs and APIs. The site mentions review twice: as where DevRel's judgment now sits, and as a grading step. It does not treat the developer's cost of checking agent output as something a platform can reduce.

**Other numbers have no stated basis.** These appear as facts with no source or derivation:

- The 20% and 40% AI-usage thresholds for hiring an Agent Champion and a team.
- The 70% ("agent-hostile") and 40% ("agent-friendly") overhead bands.
- The MCP diagram's overhead figures (about 100%, 70–80%, 30%).
- "The 20% of Developer Advocates who already do this work informally."
- The documentation drift target of under 7 days.
- "Almost every team that does this for the first time discovers that their FAISR is significantly lower than they assumed."

The usage thresholds are also hard to apply. They refer to the share of a platform's own developers who use AI tools for integrations, which the site gives no way to measure. General surveys cannot stand in for it: the 2026 Stack Overflow survey reportedly has 83% of developers using at least one AI tool [S23], but that is a different population and a broader activity.

### 3.2 The metric

**"First attempt" is undefined, and agents now work in loops.** The site defines success as working code "on the first attempt without manual correction". Coding agents write, run, read the error and retry on their own, and the definition does not say whether those retries count. The vendors who publish evaluations handle this explicitly:

- Stripe's best runs averaged 63 turns [S7, relayed figure].
- Supabase lets agents "retry once after a failure before grading them" [S9].
- Vercel's public Next.js board reports pass@4 and keeps pass@1 as a separate measurement [S8, relayed].

A developer cares whether the agent got there, how long it took, what it cost and how much they had to step in. First-attempt success is one input to that.

**The recommended sample cannot see the promised effect.** The site's protocol is 10 to 15 tasks through two tools, once each. Treating 20 runs as independent, a measured 50% has a 95% interval of roughly 30% to 70%. The site talks about a programme that "improves FAISR by ten points"; that is well inside the noise. For scale, Stripe reports that its plugin lifted scores by about 3 to 8 points, from 69 scenarios with two repetitions per arm across 14 agents [S7].

**The score depends heavily on how strict the grader is.** In the same Stripe evaluation, requiring every necessary criterion to pass drops the average from 78.1% to 29.4% [S7]. A single FAISR number, without the rubric and strictness stated, is not comparable across companies or over time. "Competitive FAISR delta" as a board metric inherits that problem.

**It varies by model and version.** The site calls models "commodities". In one study, an ORM went from 79% of Claude Code's picks under one model version to 0% under the next [S10]. In Stripe's evaluation, one model made 53% more tool calls with the plugin and another 26% fewer [S7]. Results belong to a model-and-harness pair and need re-running on each release.

**The link to adoption is asserted.** FAISR is called "a direct causal metric" (teams page), one that "directly predicts adoption" (companies page), and "the most important thing DevRel has ever had" (first essay). The site offers no data connecting it to signups, activation or retention. It is a reasonable hypothesis and should be presented as one.

**The log-signature method is unvalidated.** The measurement page says AI-generated code has "characteristic error patterns in API logs that distinguish it statistically from human-authored code" (burst 401s at session start, fixed-interval 429s). No evidence is given. Human-written first integrations fail in similar ways.

**It measures only the agents that arrive.** FAISR starts once an agent is already integrating. It says nothing about the agents that recommended a competitor, or built their own (section 3.3). The "competitive FAISR" benchmark compares platforms on tasks the tester chose, which is not the same as observing what an agent chooses unprompted.

### 3.3 Scope: what the framework leaves out

| Gap | Why it matters now | Evidence |
|---|---|---|
| **Selection.** Does the agent pick the platform? | The companies page does argue that buyers now ask an agent to run the proof of concept. It offers no way to measure what agents choose when not told which platform to use. Claude Code chose a custom or DIY build in 12 of 20 categories, and converged on a default stack elsewhere (Stripe 91% of payment picks, Vercel 100% of JS deployments). A platform can have a perfect success rate and never be chosen. | [S10] |
| **Whether artifacts work.** | Results are mixed. Vercel: a docs index in AGENTS.md took pass rate from 53% to 100%, while a skill with default behaviour added nothing. Supabase: a skill loaded in about one session in ten until its description was rewritten. Three independent studies, which I have only as relayed excerpts, point different ways. SkillsBench reports a substantial average gain from curated skills (about 16 points, much smaller for software engineering tasks, with some tasks made worse). SWE-Skills-Bench reports under one point. An evaluation of repository context files found they did not generally improve success and raised cost by over 20%. | [S8] [S9] [S22] |
| **The artifact landscape.** | The site knows docs, "prompt recipes" and MCP. Agent Skills and AGENTS.md are now projects of the Linux Foundation's Agentic AI Foundation, alongside MCP. MCP itself went stateless in July 2026. Vendors ship plugins, CLIs and "code mode". A three-tier MCP ladder no longer describes the choices. | [S17] [S18] |
| **Security.** | Agent-facing text is an attack surface. Microsoft documented poisoned MCP tool descriptions; a Cloud Security Alliance note reports a 36.5% average attack success rate. A recipe library or skill is a supply chain. | [S19] |
| **Traffic, cost and identity.** | One docs host reports agents at 66% of measured docs traffic in July 2026, up from 15.2% at the start of the year (vendor data on its own customers). Markdown delivery, bot policy, signed agent identity and payment for agent requests are live decisions. The MCP spec now hardens authorisation. | [S13] [S24] [S18] [S26] |
| **Maintainers and the open-source commons.** | Agents opened about 30% of sampled GitHub PRs in Q3 2026. curl ended its bug bounty; tldraw and Hono closed external PRs. An "Agentic Hackathon" that produces agent-written contributions lands in this context. | [S11] [S20] |
| **Agents as users at runtime.** | The definition mentions "autonomous AI systems", but every page is about coding assistants writing integration code. Agents that operate a product (provisioning, paying, acting for a user) are not covered. | [S16]; [S28] relayed |
| **Ownership.** | The site describes the Agent Champion filing improvement requests with platform engineering, which is a hand-off but not an answer to who decides. Stripe's Agent Experience team is an engineering team of 10+ under an engineering manager. The site answers "this is an engineering problem" with "DevRel has always influenced documentation". | [S16] |

**"Encoded judgment is the moat" is the principle most at risk.** The site says the recipe library "compounds rather than depreciates". A maintained body of knowledge can grow while individual entries go stale, as the site's own freshness metric accepts, so this is not a contradiction. The problem is that the return is assumed. The evidence above says some artifacts do nothing, some are never loaded, and capable models already pass many tasks unaided (Supabase: two models scored 100% on the build stage with no skill [S9]). None of that shows the underlying judgment is worthless. It shows that each way of delivering it has to be tested.

**The retrieval model is dated.** The Documentation Architect role is framed around "chunking strategy" and "RAG accuracy". Coding agents increasingly fetch whole pages as markdown; in the Mintlify data, most agent requests came through explicit machine routes such as `.md` URLs [S13, vendor]. Optimising for a vendor-run retrieval pipeline is a narrower problem than it looked in April.

### 3.4 Organisation and roles

- **I found no uptake of the three roles.** My searches turned up no use of "Agent Champion", "Documentation Architect for Agent Consumption" or "API Experience Designer" outside the site. That is a search result, not proof. The one title I did find in the market is "Agent Experience" [S16].
- **Two of the three roles describe work that usually has another owner.** Documentation structure commonly belongs to a docs team, and API errors, auth and rate limits to platform engineering. I have no survey data on how often. Naming them as DevRel roles claims territory without explaining who decides.
- **"Ambassadors → Agent Champions" is a category error.** Ambassadors are external community members. The Agent Champion is an internal staff role. One does not become the other.
- **The two-layer split is too rigid on staffing.** The site's diagram does show feedback flowing both ways between the layers, and separate budget floors are a sensible way to protect community work. But the framework document says the layers "cannot be merged" and cannot be served by the same practitioners at full load. If models learn preferences from what humans publish and discuss, the human community is upstream of agent selection, and the people doing each kind of work need to be close. (That "if" is my inference; a vendor makes the same argument [S25, relayed].)

### 3.5 The 37 patterns

I compared the site's list with the book's contents as shown in a library catalogue [S21].

- **The lists differ.** The site omits **Booth** and **Product/Service Development**. It splits Newsletter into "Newsletter (technical)" and "Community Newsletter" and adds **Boot Camp**, which is not a chapter. The total is 37 either way, which hides the mismatch.
- **The omitted pattern is the most relevant one.** Product/Service Development, DevRel feeding what it learns back into the product, is the mechanism the whole framework depends on.
- **The page contradicts itself.** It says every pattern "bifurcates", then lists 14 as "irreducibly human".
- **It contradicts the business case.** Customer Pre-Sale is filed as purely human. The For Companies page argues that buyers now ask an agent to run the proof-of-concept.
- **Several placements are asserted without argument.** Swag, Sponsorship and Webinar "grow more valuable"; Podcast and Webinar are treated as human-only although transcripts are text that models read.
- **Only three patterns get any analysis.** The other 34 are a label each.

### 3.6 Positioning and credibility

- **"Coined" and "canonical".** These are three separate questions. *Who coined the phrase?* The author may well have; I found no earlier use, and AX being older does not change that. *Is the idea new?* No: Mathias Biilmann introduced "Agent Experience" on 28 January 2025 [S15], and Netlify publishes an open-source scoring framework, AXIS. *Is the site the canonical reference?* That is for others to grant. The site never mentions AX, and a reader who knows the field will notice.
- **A metric defined by one author, next to commercial interests.** The site invites advisory and consulting enquiries, and the About page describes EcoSynt, an unreleased measurement product, as "the proof of concept" for the framework. (Research also reported a paid FAISR audit offered elsewhere; I did not see that page and do not rely on it.) None of this is improper. But a headline metric that only its author defines, alongside products and services that measure it, will read as marketing unless the method is open.
- **The site does not do what it recommends.** It has no markdown versions of its pages, no `llms.txt`, and no links to the sources of its statistics. That is a small thing, and an easy credibility win.
- **Absolutes.** "Agents don't tolerate ambiguity", "AI agents don't operate on trust", "work that AI cannot do on itself", "the most important thing DevRel has ever had". Each is stronger than the evidence, and each gives a critic an easy target.
- **Small dated details.** "Codeium" was renamed in 2025. The site plan still names a different domain.

## 4. What holds up

| Claim | Status |
|---|---|
| Platforms have a second, non-human audience. | Now mainstream. Netlify's AX definition says the same [S15]. DevRelCon 2026 reportedly ran several agent-facing talks; I saw only a programme listing relayed by research, no talk content. |
| Agent failures are silent to traditional dashboards. | Still true by default. It is now fixable: docs hosts and CDNs expose agent traffic. [S13] [S24] |
| The agent ecosystem is shaped by choice or neglect. | Better evidenced than in April. Agents converge on default stacks, and those defaults shift between model versions. [S10] |
| Run canonical tasks through agents and score them. | Vindicated. Stripe, Vercel, Supabase and Convex publish this kind of evaluation. [S7] [S8] [S9] |
| An MCP server is a starting point, not the finish. | Supported, though for different reasons than the site gives: context cost, and competition from skills, CLIs and plain docs. [S8] [S28] |
| Human, in-person community work gains value as generated content floods channels. | Plausible and widely argued. I found no data either way. |
| Start with one person, one day a week, no new budget. | Good practical advice. Keep it. |

## 5. Claim-by-claim audit

Verdicts: **Keep**, **Fix** (the idea survives; the statement must change), **Drop**.

| # | Claim on the site | Where | Finding | Verdict |
|---|---|---|---|---|
| 1 | Dean: infinitely fast model gives 2–3× in software development | definition, Amdahl page, essay | Quote is about latency and tool start-up, conditional | Fix |
| 2 | "The other 47× is eaten by the environment" | same | Not in the quote; invalid subtraction | Drop |
| 3 | 80% tool share gives a 5× ceiling | definition, essay, two diagrams | Arithmetic inverted; correct figure 1.25× | Fix |
| 4 | METR: 19% slower, believed 20% faster | four places | Accurate for the 2025 study; 2026 update omitted | Fix |
| 5 | "The model wasn't the variable. The environment was." | Amdahl page, essays, companies page | Not tested by METR | Drop |
| 6 | Jellyfish: 1.36 to 2.9 PRs at companies that rebuilt toolchains | four places | Source compares 0% and 100% AI adoption | Drop as stated |
| 7 | Over 70% overhead is agent-hostile; under 40% agent-friendly | Amdahl page | No basis given | Drop |
| 8 | MCP tiers with overhead of ~100%, 70–80%, 30% | diagram | No basis; tiering overtaken | Drop |
| 9 | FAISR "directly predicts adoption"; "direct causal metric" | companies page; teams page and first essay | No evidence offered | Fix (state as hypothesis) |
| 10 | 10–15 tasks, two tools, weekly | measurement, roles | Too small to detect ten-point changes | Fix |
| 11 | AI-generated code has distinct API log signatures | measurement | Unvalidated | Fix (hypothesis) |
| 12 | "AI models are commodities" | definition | Results vary by model and version | Fix |
| 13 | Recipe library "compounds rather than depreciates" | roles | Return is assumed; artifact evidence is mixed | Fix |
| 14 | Hire at 20% AI adoption; a team at 40% | roles, companies | No basis; no way given to measure it | Drop |
| 15 | Agents "retrieve"; optimise for chunking and RAG | roles | Partly dated | Fix |
| 16 | Three new DevRel roles | roles | No uptake found; two usually have another owner | Fix (responsibilities, not titles) |
| 17 | Layers "cannot be merged" | framework doc | Too rigid on staffing; the diagram already shows feedback both ways | Fix |
| 18 | All 37 patterns bifurcate; 15 / 8 / 14 split | patterns | List does not match the book; internal contradictions | Fix |
| 19 | Ambassadors become Agent Champions | patterns | Category error | Drop |
| 20 | "Coined", "canonical" | home, about, definition | "Coined" may be true of the phrase; "canonical" is not the author's to claim; AX (January 2025) is unacknowledged | Fix: acknowledge AX, drop "canonical" |
| 21 | Two audiences; silent failures; shaped by choice or neglect | definition | Supported | Keep |
| 22 | Week-one exercise | teams page | Sound; needs a larger sample to draw conclusions | Keep |

## 6. Debates since April 2026, and where the framework stands

| Debate | One side | The other | What it means here |
|---|---|---|---|
| Is this DevRel's job? | Agents are a new audience; DevRel knows the developer's tasks and already runs the feedback loop. | The fixes are in docs tooling, API design and auth, so engineering should own it (Stripe's model). | Define DevRel's share and the hand-offs. Do not claim the whole. |
| Do curated artifacts help? | Vendors report large lifts from the right artifact, delivered the right way. | Independent results are split: one benchmark reports a substantial average gain from curated skills, another almost none, and a study of repository context files no general gain at higher cost. Capable models already pass many tasks unaided. | Require a measured with-and-without difference for every artifact. |
| MCP, skills, CLI or plain docs? | MCP suits authenticated live systems. | Tool definitions consume context; always-loaded docs and CLIs often do better. | Stay format-neutral. Judge by effect and cost. |
| Is `llms.txt` worth it? | Cheap, and coding agents were the largest AI reader of it in one study. | In the same study, 97% of files received no requests at all. [S14] | Do not promise visibility. Measure whether it is fetched. |
| Does AI raise productivity? | METR now leans towards speedup, with weak data; reported AI use is high. | One study reports more code but much less extra finished work, and heavier review. | Stop citing productivity studies as proof of the environment thesis. Add verifiability as a design goal. |
| Should agents contribute to open source? | Agents now open a large share of PRs. | Maintainers are closing the door. | Agent-facing programmes need rules that protect maintainers. |
| Is DevRel obsolete? | Generic content is commoditised. | Trust, taste and product feedback are not. | The framework's position (human work gains value) stands, but lacks data. |

## 7. Sources

IDs are not contiguous; some candidate sources were dropped during checking.

| ID | Source | Date | Grade |
|---|---|---|---|
| S1 | Repository `cwoodruff/agenticairelations`, commit `9522c18` | 2026-07-19 | D |
| S2 | OfficeChai report of Jeff Dean at NVIDIA GTC 2026: https://officechai.com/ai/will-need-to-re-engineer-tools-so-that-they-can-keep-up-with-the-speeds-of-ai-agents-googles-jeff-dean/ | 2026-03-29 | E, secondary |
| S3 | METR, "We are Changing our Developer Productivity Experiment Design": https://metr.org/blog/2026-02-24-uplift-update/ (URL relayed; excerpt seen via a PDF copy) | 2026-02-24 | E |
| S4 | METR 2025 study figures, via summary: https://www.ai-first.company/evidence/studies/developers-slower-with-ai/ | 2026-10-17 | E, secondary |
| S5 | Jellyfish, "Jellyfish and OpenAI Team Up to Measure the Impact of AI Coding Tools": https://jellyfish.co/blog/jellyfish-openai-team-up-to-measure-impact-of-ai-coding-tools/ | 2025-08-13 | E, vendor |
| S6 | InfoQ on the Harvard study of Jellyfish data: https://www.infoq.com/news/2026/10/jellyfish-ai-productivity/ | 2026-10-22 | E, secondary |
| S7 | Stripe, integration evals methodology: https://stripe.dev/blog/stripe-integration-evals-methodology . The 63-turn figure is from an earlier Stripe post and is grade R. | 2026-11-19 | E, vendor |
| S8 | Vercel, "AGENTS.md outperforms skills in our agent evals": https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals . The pass@1 and pass@4 detail is from `vercel/next-evals-oss` and is grade R. | 2026-01-27 | E, vendor |
| S9 | Supabase, "Introducing Supabase Evals": https://supabase.com/blog/introducing-supabase-evals | 2026-07-31 | E, vendor |
| S10 | Amplifying, "What Claude Code Actually Chooses": https://amplifying.ai/research/claude-code-picks/report | undated | E |
| S11 | RedMonk Agent Activity Index, Q3 2026: https://redmonk.com/sogrady/2026/11/18/agent-activity-index-q326/ | 2026-11-18 | E |
| S13 | Mintlify docs traffic reports: https://www.mintlify.com/blog/state-of-docs-traffic and https://www.mintlify.com/blog/state-of-ai. The first gives 15.2% agent share at the start of 2026 and 66% in July; the second gives 45.3% for March. I could not check whether the two reports define agent traffic the same way. | 2026-07-29, 2026-04-03 | E, vendor |
| S14 | Ahrefs llms.txt study: https://ahrefs.com/blog/llmstxt-study/ | 2026-06-15 | E, vendor |
| S15 | Netlify, Agent Experience: https://www.netlify.com/agent-experience/ ; glossary dating Biilmann's post to 28 January 2025: https://agentexperience.tech/glossary/ | undated; 2026-09-01 | E, vendor |
| S16 | Stripe, "Engineering Manager, Agent Experience" posting: https://careers.atomico.com/companies/stripe/jobs/72871435-engineering-manager-agent-experience | seen 2026-05 | E |
| S17 | Linux Foundation, AAIF announces Agent Skills and three other projects; the excerpt lists AGENTS.md and MCP among existing AAIF projects: https://www.linuxfoundation.org/press/agentic-ai-foundation-announces-four-new-projects-agent-skills-open-responses-openenv-and-opensandbox | 2026-10-22 | E |
| S18 | MCP specification 2026-07-28 release post (in the `modelcontextprotocol/modelcontextprotocol` repository) | 2026-07-28 | D, opening sections only |
| S19 | Microsoft Security blog on MCP tool poisoning: https://www.microsoft.com/en-us/security/blog/2026/06/30/securing-ai-agents-ai-tools-move-from-reading-acting/ ; Cloud Security Alliance research note: https://labs.cloudsecurityalliance.org/research/csa-research-note-mcp-tool-poisoning-auto-execution-20260701/ | 2026-06-30, 2026-07-01 | E |
| S20 | InfoQ on maintainers closing to outside contributions: https://www.infoq.com/news/2026/02/ai-floods-close-projects/ ; LavX on Hono and others: https://news.lavx.hu/article/ai-generated-pull-requests-flood-open-source-projects-forcing-maintainers-to-close-doors | 2026-02-24, 2026-10-06 | E, secondary |
| S21 | Penn State library catalogue entry listing the book's chapters: https://catalog.k8s.libraries.psu.edu/catalog/50452243 | undated | E |
| S22 | arXiv 2602.11988 (AGENTS.md evaluation), 2603.15401 (SWE-Skills-Bench), 2602.12670 (SkillsBench) | 2026 | R |
| S23 | Stack Overflow Developer Survey 2026, AI section: https://survey.stackoverflow.co/2026/ai | 2026 | R |
| S24 | Cloudflare, Markdown for Agents: https://blog.cloudflare.com/markdown-for-agents/ | 2026-02-12 | E, vendor |
| S25 | Lightsage, "AgentRel vs DevRel": https://lightsage.com/resources/agentrel-vs-devrel | 2026-10-28 | R, vendor |
| S26 | IETF Web Bot Auth draft and `cloudflare/web-bot-auth` (GitHub) | active 2026-11 | R |
| S28 | Cloudflare, Code Mode: https://blog.cloudflare.com/code-mode-mcp/ ; Cloudflare and Stripe Projects: https://blog.cloudflare.com/agents-stripe-projects/ | 2026-02-20, 2026-04-30 | R, vendor |

### Not found, or not usable

- The primary video or transcript of Dean's GTC session. The quote rests on one news report and one LinkedIn post.
- The METR 2025 paper itself, and the Harvard paper and its authors.
- Any 2026 statement by a named DevRel practitioner on who should own this work. I attribute no views to individuals.
- A "State of DevRel 2026" survey, or 2026 data on DevRel team sizes.
- Any published criticism of, or response to, this framework specifically.
- A quote attributed to RedMonk's Stephen O'Grady about "agent relations" reaches me only through a vendor page. I have not used it.
- A vendor "agent readiness" benchmark (Glintbase) surfaced in research. I did not see its method and have not relied on it.
