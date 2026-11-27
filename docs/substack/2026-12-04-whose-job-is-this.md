<!--
Title:        Whose Job Is This?
Subtitle:     I proposed three new DevRel roles. I was wrong about two of them.
Email preview: Making a platform work for AI agents is shared between DevRel, docs, engineering, security, and product. Here is the part that belongs to DevRel.
Publish on:   2026-12-04
Canonical URL: https://agenticairelations.com/essays/whose-job-is-this/   (Substack: Settings for the post > SEO > Canonical URL)
Tags:         roles, devrel, agent-experience, staffing
Everything below this comment is the post body.
-->

In April I proposed three new roles for Developer Relations: the Agent Champion, the Documentation Architect for Agent Consumption, and the API Experience Designer.

I was wrong about two of them, and half right about the third.

## What I got wrong

The Documentation Architect restructures documentation so machines can use it. The API Experience Designer changes error models, sign-in flows, and rate limits. Both are real jobs. Neither is a DevRel job in most companies. Documentation structure belongs to the docs team. The API surface belongs to platform engineering.

By naming them as DevRel roles I was claiming territory, and the objection I answered too quickly, "this is an engineering problem," was mostly correct.

The market had already answered the question anyway. The name that caught on for how agents fare on a platform is Agent Experience, a term Netlify's Mathias Biilmann introduced in early 2025, and the teams forming around it sit in engineering. Stripe, for one, has [advertised for an engineering manager](https://careers.atomico.com/companies/stripe/jobs/72871435-engineering-manager-agent-experience) to lead an Agent Experience team of more than ten engineers.

## So what is left for DevRel?

Quite a lot, and it is the part nobody else is placed to do.

**The task list.** Somebody has to know what developers actually ask agents to do with the platform. Engineering knows the API. DevRel knows the questions, because it has been answering them for years.

**The judgment.** An integration can build, run, and still be wrong: the wrong pattern, no handling for the error everyone hits in week two. Deciding what a correct result looks like is a judgment call, and it belongs to the people who have watched integrations succeed and fail.

**The feedback loop.** DevRel already carries what developers struggle with back to the product team. Agent failures are the same cargo with better evidence attached.

**The relationships.** With the community, as always. And now with a new kind of partner: the companies that build the agents and models your developers use.

Put together, those four make an evaluation suite. A list of tasks, each with a check for whether the result is right, run against the agents that matter. Engineering may build the machinery. What goes in it comes from DevRel.

## The Agent Champion, revisited

This is the role I was half right about. The work is real: someone runs the evaluation, keeps the guidance for agents current, and turns failures into specific requests. Someone in DevRel should own it.

What I got wrong was the artifact. I described the job as curating a recipe library. The evidence since then says that what you publish for agents helps only some of the time. [Vercel found](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals) that a skill left at its defaults did nothing for its pass rate, while a short documentation index did a great deal. [Supabase found](https://supabase.com/blog/introducing-supabase-evals) that one of its skills loaded in about one session in ten until they rewrote its description.

So the asset is the evaluation, which tells you what works, and the recipes are whatever survives it. I would no longer invent a title for this person either. "Developer Advocate, Agent Experience" will fit on most career ladders.

## When agents do more than write code

The division shifts again when an agent operates your product for a user: creating resources, spending money, acting with someone's credentials. That is mostly engineering and security work. Scoped permissions, spending limits, a way to revoke access, an audit trail.

DevRel's part is smaller there, and still specific: find out what users are handing to agents, explain the limits in plain language, and report where agents fail or overreach.

## A smaller claim, a firmer one

Version one of this framework said DevRel should own the agent layer. Version two says DevRel should own the evidence about it.

That is a narrower claim. I think it is also one that would survive a meeting with an engineering director, which I doubt the first one would.

If you lead a DevRel team, the conversation to have this month is with your counterpart in platform engineering. Ask who is looking at how agents fare on the platform. If the answer is nobody, offer to bring the task list.

---

*See [Who Does the Work](https://agenticairelations.com/new-roles/) for the full responsibility table. The April essay this one revises is [The Agent Champion](https://agenticairelations.com/essays/the-agent-champion/).*

---

*This essay first appeared at [agenticairelations.com](https://agenticairelations.com/essays/whose-job-is-this/). The measurement specification and harness it refers to are open: [github.com/cwoodruff/agenticairelations](https://github.com/cwoodruff/agenticairelations).*
