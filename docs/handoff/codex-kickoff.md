# Starting an AI agent (Codex)

Paste the first message when you connect Codex to the repository. Use the second for every following issue.

## First message

```
You are working on glance-mail, a front-end demo of Glance, an AI briefing layer for email.

Before doing anything:
1. Read AGENTS.md fully. It is the contract for how you work in this repository.
2. Read docs/product-brief.md, docs/user-flows.md, docs/design-rules.md, docs/design-system.md and docs/data-model.md.
3. Look at docs/screens/ and open docs/prototype/index.html to see what the result should look like.

Rules that matter most:
- Design owns src/design-system/tokens/tokens.css and src/data/*.json. Do not change them; propose changes in a separate PR.
- Use tokens for every design value. No raw hex or px outside tokens.css.
- Product screens use only design-system components. If a component is missing, open a separate ds/ PR first.
- Do not make product decisions. If something is not documented, list it under Open questions in the PR.

Your task now: issue 01 in docs/handoff/issues/ (Scaffold the app and deploy it to GitHub Pages).
Work on a branch named chore/scaffold, open one pull request, and write the description for a designer
using the template in AGENTS.md, including screenshots. Do not merge.
```

## Every following issue

```
Next task: issue NN in docs/handoff/issues/ (title).
Re-read the sections of AGENTS.md and docs/ that the issue references.
Branch name: <label>/<short-name>. One pull request, description in the AGENTS.md format with screenshots
(light and dark where relevant). Do not merge. If anything in the issue conflicts with the docs, follow the docs and
say so under Open questions.
```

## When the reviewer asks for changes

```
Review comments are on PR #NN. Address each one in a new commit on the same branch, reply to each comment with
what you changed, and update the screenshots. If you disagree with a comment, explain why in the reply instead of
changing the code.
```
