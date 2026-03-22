#!/bin/bash
# Pre-Compaction Hook — save state before context compression

if [ "$TEST_MODE" = "1" ]; then
  echo "test-mode: would save pre-compaction state"
  exit 0
fi

if [ -d "brain/01-daily" ]; then
  d=$(date +%Y-%m-%d)
  f="brain/01-daily/${d}.md"
  if [ ! -f "$f" ]; then
    echo "# Session Log: ${d}" > "$f"
  fi
  echo "" >> "$f"
  echo "## Pre-compaction save: $(date +%H:%M)" >> "$f"
  changed=$(git diff --name-only HEAD 2>/dev/null || true)
  if [ -n "$changed" ]; then
    echo "Changed files:" >> "$f"
    echo "$changed" >> "$f"
  fi
  echo "IMPORTANT: Save current task state to tasks/current.md before compaction"
fi

exit 0
