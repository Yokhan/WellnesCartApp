#!/usr/bin/env bash
# test-template.sh — Smoke test for agent-project-template
# Verifies all required files exist and JSON is valid

set -euo pipefail

ERRORS=0
CHECKS=0
TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$TEMPLATE_DIR"

pass() { echo "  PASS: $1"; CHECKS=$((CHECKS+1)); }
fail() { echo "  FAIL: $1"; ERRORS=$((ERRORS+1)); CHECKS=$((CHECKS+1)); }
check() { local d="$1"; shift; if "$@" &>/dev/null; then pass "$d"; else fail "$d"; fi; }

echo "=== Template Smoke Test: $TEMPLATE_DIR ==="
echo ""

echo "Required files:"
check "CLAUDE.md" test -f CLAUDE.md
check "README.md" test -f README.md
check "setup.bat" test -f setup.bat
check ".gitignore" test -f .gitignore
check ".env.example" test -f .env.example
check "tasks/lessons.md" test -f tasks/lessons.md
check "tasks/current.md" test -f tasks/current.md
check "scripts/check-drift.sh" test -f scripts/check-drift.sh

echo ""
echo "Claude config:"
check ".claude/settings.json" test -f .claude/settings.json
check "settings.json valid JSON" python -m json.tool .claude/settings.json
check ">=6 rule files" bash -c '[ $(ls .claude/rules/*.md 2>/dev/null | wc -l) -ge 6 ]'
check ">=7 agent files" bash -c '[ $(ls .claude/agents/*.md 2>/dev/null | wc -l) -ge 7 ]'
check ">=10 skill dirs" bash -c '[ $(ls -d .claude/skills/*/ 2>/dev/null | wc -l) -ge 10 ]'
check ">=8 command files" bash -c '[ $(ls .claude/commands/*.md 2>/dev/null | wc -l) -ge 8 ]'

echo ""
echo "Brain vault:"
check "brain/00-inbox" test -d brain/00-inbox
check "brain/01-daily" test -d brain/01-daily
check "brain/02-projects" test -d brain/02-projects
check "brain/03-knowledge" test -d brain/03-knowledge
check "brain/04-decisions" test -d brain/04-decisions
check ">=3 brain templates" bash -c '[ $(ls brain/templates/*.md 2>/dev/null | wc -l) -ge 3 ]'

echo ""
echo "File sizes:"
check "CLAUDE.md <=200 lines" bash -c '[ $(wc -l < CLAUDE.md) -le 200 ]'

echo ""
echo "Results: $((CHECKS-ERRORS))/$CHECKS passed"
if [ $ERRORS -eq 0 ]; then
    echo "Template is healthy!"
    exit 0
else
    echo "$ERRORS check(s) failed"
    exit 1
fi
