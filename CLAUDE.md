# SmartCart PVM
<!-- Template Version: 3.4.0 -->

Умный помощник закупки продуктов для фитнес-тренеров и их клиентов. Убирает необходимость думать о еде каждый день — готовый список покупок, который подстраивается под привычки и тихо улучшает их.

## Philosophy — Quality Over Speed
1. **Think before you type.** Research and planning ARE the work. Code is just output.
2. **Doubt is a feature.** Surface uncertainty. Enumerate alternatives before choosing.
3. **Slower is faster.** 30-min plan saves 3h rework. Test scenarios prevent production bugs.
4. **One thing done well > three halfway.** Finish, verify, commit before starting next.
5. **If unsure, STOP and ask.** Never produce code just to show progress.

Slow down: shared/core, can't articulate WHY, 3+ iterations, HIGH/CRITICAL risk.
Speed OK: XS+LOW, covered by tests, following approved plan.

## Stack

- **Frontend:** React Native (iOS + Android) / Telegram Mini App (для быстрого старта)
- **Backend:** Node.js + Express + TypeScript. Zod validation. Jest tests.
- **LP-солвер:** Python + FastAPI + PuLP/CBC (микросервис)
- **БД:** PostgreSQL 16 через Supabase (Auth + Storage)
- **Кэш:** Redis + ioredis
- **Данные:** OpenFoodFacts + ручное заполнение universal_products + парсинг каталогов магазинов
- **Цены:** Парсинг / API мобильных приложений Пятёрочки, Перекрёстка, ВкусВилла
- **Frontend:** React + Vite + TypeScript + Tailwind + Zustand (TMA)

## Map
- `backend/src/core/` — чистая доменная логика (Quality Gate, Value Score, LP): без IO
- `backend/src/shared/` — типы, утилиты, валидаторы
- `backend/src/services/` — IO-слой (Supabase, Redis, HTTP)
- `backend/src/controllers/` — Express controllers
- `backend/src/routes/` — Express route definitions
- `backend/src/middleware/` — auth, validation, error handling, CORS, rate limiting
- `backend/src/jobs/` — cron jobs (list generation, price refresh)
- `lp-solver/` — Python FastAPI микросервис (PuLP ILP)
- `frontend/src/` — React TMA (screens, stores, components, services)
- `database/` — SQL migrations + seed data
- `docs/` — спецификации, архитектура, ADR, доказательная база
- `_reference/` — эталонные реализации
- `scripts/` — утилиты (drift detection, template sync и др.)
- `brain/` — Obsidian vault, persistent memory
- `tasks/` — lessons, current task, research cache

## How This Template Works

**Rules are NOT pre-loaded.** They live in `.claude/library/` and load ON DEMAND per task.

**On every new task**:
1. User gives task (any language, any jargon)
2. YOU extract English keywords: task type + domain + action
3. Call `get_context(keywords="...")` → default depth=brief (~50 tokens: mode + agent + file list)
4. For M+ tasks: `get_context(keywords="...", depth="normal")` → includes full rule text
5. For L/XL or unfamiliar domain: `depth="full"` → rules + lessons + git + registry + ecosystem
6. Work. Read specific files from the list only when you need them.

**On task switch**: `switch_context(keywords="...")`
**After compaction**: `get_active_rules()`
**Fallback (no MCP)**: `bash scripts/route-task.sh "<keywords>"` + Read listed files
**Manual**: `/mode-code` `/mode-design` `/mode-review` `/mode-research` `/mode-write` `/mode-fix` `/mode-plan`

## Session Start
1. `bash scripts/context-restore.sh` — shows mode, task, lessons, git state
2. If Engram: `mem_session_start` + `mem_context`
3. `get_context(keywords="<first task>")` → ready to work

## Session End
Update `tasks/current.md` with handoff (status, files, next steps, blockers).
If Engram: `mem_session_end` with summary.

## MCP Memory (Engram) — PROACTIVE
- After EVERY decision/bug/discovery → `mem_save` immediately
- Before research → `mem_search` first
- On task switch → `mem_save` summary of paused task
- If no Engram → tasks/lessons.md + brain/ (file fallback)

## Runtime Helpers (use instead of manual tool calls)
```
bash scripts/route-task.sh <task>      — route to relevant rules (0 tokens)
bash scripts/research.sh <path>        — auto research (replaces 6 tool calls)
bash scripts/plan-scaffold.sh <task>   — auto plan template in tasks/current.md
bash scripts/verify-check.sh --size M  — auto verification checklist
bash scripts/context-restore.sh        — context recovery after compaction
bash scripts/measure-context.sh        — token budget meter (chars/token heuristic)
bash scripts/blast-radius.sh <file>    — BFS impact analysis: all affected files
bash scripts/import-graph.sh [dir]     — hot files: most-imported modules
bash scripts/scan-repo.sh <path>       — security scan before opening untrusted repos
```

## Security & Integrations
Hooks enforce automatically: prompt injection scanning, sensitive path blocking, dangerous command blocking, session audit logging. See `.claude/hooks/`.
Optional: **CodeSight** codebase index — see `integrations/codesight.md`, enable in `.mcp.json`.

## Design Work — HARD RULES (Figma, CSS, UI)
1. **NEVER hardcode visual values.** Use tokens/variables. Create tokens FIRST if missing.
2. **NEVER build from raw shapes.** Use components. Create components FIRST if missing.
3. **Build order: System→Tokens→Components→Screens.** NEVER skip to screens.
4. **Every container must have layout mode** (auto-layout / flexbox / grid).
5. **8 states**: Default, Hover, Active, Focus, Disabled, Loading, Error, Empty.
6. **Before creating**: search_design_system — does it already exist?
Violation = revert and redo. Full pipeline: `.claude/library/domain/domain-design-pipeline.md`

## Две ключевых системы MVP

1. **Quality Gate** — фильтрация товаров по NutriScore-2023, NOVA, трансжирам (docs/BRD.md#RF-02)
2. **Value Score** — LP-оптимизация корзины + Composite Score для ранжирования свопов (docs/BRD.md#RF-03)

**NOT MVP:** Taste Engine (CF + SVD) → v1.5 | Vision AI (фото холодильника) → v1.5

## Стратегия данных

- **Tier A** (`universal_products`): ~50–80 эталонных позиций, полный состав, без парсинга. Достаточен для MVP.
- **Tier B** (`products`): брендовые SKU из парсинга + авто-QG фильтрация. Расширяется постепенно.

## Commands (23)
/setup-project, /implement, /commit-push-pr, /review, /refactor, /sprint, /brain-sync, /weekly,
/status, /rollback, /onboard, /update-template, /hotfix, /retrospective, /sync-all,
/audit-tools, /mode-code, /mode-design, /mode-review, /mode-research, /mode-write, /mode-fix, /mode-plan

## Self-Improvement
After each correction: classify type (BUG/KNOWLEDGE_GAP/STYLE/DESIGN_DISAGREEMENT/MISUNDERSTANDING).
BUG or KNOWLEDGE_GAP → log to tasks/lessons.md with Track (BUG/KNOWLEDGE/PATTERN/PROCESS) + Severity (P0-P3).
When >50 entries → promote via `/weekly`.

## Token Economy
- Trust skills/memory over re-reading. Don't re-read files you read this session.
- Only read files you WILL use. Parallelize independent tool calls.
- Route outputs >20 lines to subagents. After 2 failed corrections → /clear.
- Task switching → HANDOFF.md (status + files + next steps), fresh session.

## Build & Test
- `cd backend && npm test` / `npm run lint` / `npm run typecheck` / `npm run dev`
- `cd frontend && npm run typecheck` / `npm run dev`
- `cd lp-solver && python -m pytest`
- `docker-compose up` — full stack

## DON'T
- Code files > 375 lines — split them
- No `any` — use `unknown` + type guards
- No mutations — return new objects
- No editing main/master directly
- No skipping tests before commit
- No committing secrets (.env, API keys)
- No presenting solutions without self-verification
- No "you're right!" without logging WHY
- No new code without checking tool-registry first
- No hardcoded visual values (use tokens)
- No building screens without components (system→tokens→components→screens)
- No surface-level analysis ("works"=HTTP 200 is NOT analysis)
- No нутритивных утверждений без уровня уверенности ([RCT] / [SR/MA] / [i])
- Свопы только внутри одного convenience_tier и use_context
- Не запрещать любимые продукты (Planned Indulgence)
- Не смешивать NutriScore и Composite Score в один итоговый score
- Не добавлять Taste Engine в MVP (v1.5)

## Контекст по запросу
- `docs/BRD.md` — полные бизнес-требования v2, юзкейсы, bootstrap-корзины, math model
- `docs/DATA_DESIGN.md` — схема PostgreSQL (universal_products, basket_templates, indulgence redesign)
- `docs/ARCHITECTURE.md` — модули и зависимости, двухуровневые данные, пайплайн двух систем
- `docs/EVIDENCE_BASE.md` — доказательная база + NutriScore в России
- `docs/DECISIONS.md` — ADR-001 — ADR-014
- `docs/API_CONTRACTS.md` — API контракты
- `_reference/README.md` — эталонные реализации

## Template Version
3.4.0 — Run `bash scripts/check-drift.sh` to verify health.

## Compaction
After compaction: `bash scripts/context-restore.sh` to recover mode + task + rules.
Сохраняй: текущую задачу, изменённые файлы, результаты тестов, найденные проблемы.
Контекст двух MVP-систем: Quality Gate (NutriScore-2023 + NOVA) → Value Score (LP + Composite Score).
