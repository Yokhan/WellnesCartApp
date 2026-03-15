#!/bin/bash
# scripts/check-drift.sh — запускать перед крупными сессиями
echo "=== SmartCart PVM: Drift Detection ==="

# 1. Проверить, что docs/ обновлены
for doc in docs/*.md; do
  age=$(( ($(date +%s) - $(stat -c %Y "$doc" 2>/dev/null || stat -f %m "$doc")) / 86400 ))
  if [ "$age" -gt 30 ]; then
    echo "⚠️  $doc не обновлялся $age дней"
  fi
done

# 2. Проверить, что index.ts каждого модуля существует
if [ -d "src/features" ]; then
  find src/features -mindepth 1 -maxdepth 1 -type d | while read dir; do
    [ -f "$dir/index.ts" ] || echo "❌ Нет index.ts: $dir"
  done
fi

# 3. Проверить что CLAUDE.md < 200 строк
if [ -f "CLAUDE.md" ]; then
  lines=$(wc -l < CLAUDE.md)
  [ "$lines" -le 200 ] || echo "⚠️  CLAUDE.md: $lines строк (лимит 200)"
fi

# 4. Проверить что нет файлов > 250 строк в src/
if [ -d "src" ]; then
  find src -name "*.ts" -o -name "*.py" | while read file; do
    lines=$(wc -l < "$file")
    [ "$lines" -le 250 ] || echo "⚠️  $file: $lines строк (лимит 250)"
  done
fi

echo "=== Done ==="
