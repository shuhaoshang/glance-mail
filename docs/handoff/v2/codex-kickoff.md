# Kickoff for Codex · Handoff 2 (Visual 2.0)

Paste this as the first message of the session.

---

You are continuing work on Glance in this repository. A redesign round is ready to build.

1. Read `AGENTS.md` in full.
2. Read `docs/handoff/v2/README.md` in full. It lists the ground rules and the order.
3. Read `docs/design-system.md` §9, `docs/design-rules.md` §16 and `docs/decisions.md` D47 to D61.
4. Open `docs/prototype/v2/index.html` and look through the pages, and the images in `docs/screens/v2/`.

Then work through `docs/handoff/v2/issues/` in the order in the README, one issue per pull request. For each issue:

- Read the issue file and the sections it references before writing code.
- Build exactly what it lists. Do not start the next issue's work early, and do not redesign anything the issue does not mention.
- Use only tokens from `tokens.css`. Do not copy CSS from the prototype pages.
- Add or update stories and tests in the same PR, and keep every CI check green.
- Take light and dark screenshots at 1280 and 390 wide and compare them with the reference images the issue names.
- If the documents do not answer something, do not guess: write it under **Open questions** with a concrete proposal and continue with the rest.
- Start the PR title with `[Codex]`, add the `codex` label, and follow the PR description format in `AGENTS.md`.

After each PR, stop and wait for the review. When review comments arrive, reply to each one separately in a comment that starts with `[Codex]`.

Start with issue 19.
