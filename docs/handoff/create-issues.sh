#!/bin/sh
# Creates the GitHub issues in order. Requires the GitHub CLI (gh) logged in to this repository.
set -e
cd "$(dirname "$0")/issues"
for label in chore ds feat; do gh label create "$label" --force >/dev/null 2>&1 || true; done
for f in $(ls *.md | sort); do
  title=$(head -n 1 "$f" | sed 's/^# //')
  label=$(grep -m1 '^\*\*Label:\*\*' "$f" | sed 's/.*`\([a-z]*\)`.*/\1/')
  tail -n +2 "$f" > /tmp/glance-issue-body.md
  gh issue create --title "$title" --label "$label" --body-file /tmp/glance-issue-body.md
done
