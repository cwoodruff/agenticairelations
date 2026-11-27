# Substack copies of the essays

Paste-ready copies of the version 2 essays for [agenticrelations.substack.com](https://agenticrelations.substack.com/). Nothing here has been posted.

| Publish on | File |
|---|---|
| 27 November 2026 | `2026-11-27-agents-choose-before-they-build.md` |
| 4 December 2026 | `2026-12-04-whose-job-is-this.md` |
| 11 December 2026 | `2026-12-11-make-it-easy-to-check.md` |

The dates match the site, where each essay appears on its date.

## How to use a file

1. The comment block at the top holds the title, subtitle, email preview text, date and tags. Copy those into Substack's own fields. Do not paste the comment block.
2. Paste everything below the comment block into the post body.
3. Set the canonical URL to the site's copy of the essay (post settings, under SEO), so search engines treat the site as the original.
4. Schedule the post for the date above, at or after 09:00 UTC, when the site's daily rebuild has made the essay live. The footer links to it.

**Check the formatting after pasting.** Substack's editor does not reliably convert pasted markdown. If headings, bold text or links arrive as raw symbols, open the essay on the site instead and copy the rendered text from the browser, which keeps the formatting.

## Regenerating

These files are generated from `src/content/essays/`. After editing an essay, run:

```bash
npm run substack
```

Do not edit the files here by hand; changes will be overwritten.
