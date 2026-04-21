# BUFF EAT
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

## Стек
- **Frontend:** Preact + TypeScript + Vite (MVP web); RN/Telegram Mini App потом
- **Backend:** Python + FastAPI, LP-оптимизация через scipy/PuLP
- **БД:** PostgreSQL 16
- **Хранилище:** Supabase (Auth + Storage)
- **Данные:** OpenFoodFacts + ручное заполнение universal_products + парсинг каталогов
- **Цены:** Парсинг / API мобильных приложений Пятёрочки, Перекрёстка, ВкусВилла

## Карта проекта
- `src/features/` — vertical slices, каждый с index.ts
- `src/shared/` — типы, утилиты, валидаторы
- `src/core/` — доменная логика (без IO): Quality Gate, Value Score, LP
- `docs/` — спецификации, архитектура, ADR, доказательная база
- `templates/` — scaffolding-шаблоны для новых модулей
- `_reference/` — эталонные реализации
- `scripts/` — утилиты (route-task.sh, research.sh, verify-check.sh и др.)
- `tasks/` — lessons, current task, post-mortems, research cache

## Две ключевых системы MVP
1. **Quality Gate** — фильтрация по NutriScore-2023, NOVA, трансжирам (docs/BRD.md#RF-02)
2. **Value Score** — LP-оптимизация корзины + Composite Score для ранжирования (docs/BRD.md#RF-03)

**NOT MVP:** Taste Engine (CF + SVD) → v1.5 | Vision AI → v1.5

## Стратегия данных
- **Tier A** (`universal_products`): ~50-80 эталонных позиций, полный состав, без парсинга
- **Tier B** (`products`): брендовые SKU из парсинга + авто-QG фильтрация

## How This Works — On-Demand Loading

**Rules are NOT pre-loaded.** They live in `.claude/library/` and load ON DEMAND per task.

**On every new task**:
1. User gives task (any language, any jargon)
2. YOU extract English keywords: task type + domain + action
3. Call `get_context(keywords="...")` → default depth=brief (~50 tokens: mode + agent + file list)
4. For M+ tasks: `get_context(keywords="...", depth="normal")` → includes full rule text
5. For L/XL: `depth="full"` → rules + lessons + git + registry + ecosystem
6. Work. Read specific files from the list only when you need them.

**On task switch**: `switch_context(keywords="...")`
**After compaction**: `get_active_rules()`
**Fallback (no MCP)**: `bash scripts/route-task.sh "<keywords>"` + Read listed files
**Manual**: `/mode-code` `/mode-design` `/mode-review` `/mode-research` `/mode-write` `/mode-fix` `/mode-plan`

Full router: `.claude/rules/router.md`

## Session Start
1. `bash scripts/context-restore.sh` — shows mode, task, lessons, git state
2. If Engram: `mem_session_start` + `mem_context`
3. `get_context(keywords="<first task>")` → ready to work

## Session End
Update `tasks/current.md` with handoff (status, files, next steps, blockers).
If Engram: `mem_session_end` with summary.

## Доменные линзы (Domain Review Skills)

7 линз в `.claude/skills/domain-*/SKILL.md`. Загружаются on-demand через router.

| Действие | Линзы |
|----------|-------|
| Фича с UI | Design + Communication + Health + Software |
| Фича без UI (core/data) | Software + Health + Science |
| Ревью кода | Software + Health (если нутритивная логика) |
| UI-тексты, описания свопов | Communication + Design |
| Бизнес-решение | Business + Strategic |
| Исследование, анализ данных | Science + Health |

**Быстрая загрузка:**
- Condensed guards: `.claude/library/domain/domain-guards.md`
- BUFF EAT-specific: `.claude/library/domain/buff-eat-guards.md`
- Design pipeline: `.claude/library/domain/domain-design-pipeline.md`

**Full docs:** `.claude/docs/domain-full/` — расширенные версии каждого домена

## Runtime Helpers
```
bash scripts/route-task.sh <task>      — route to relevant rules (0 tokens)
bash scripts/research.sh <path>        — auto research (replaces 6 tool calls)
bash scripts/plan-scaffold.sh <task>   — auto plan template in tasks/current.md
bash scripts/verify-check.sh --size M  — auto verification checklist
bash scripts/context-restore.sh        — context recovery after compaction
bash scripts/measure-context.sh        — token budget meter
bash scripts/blast-radius.sh <file>    — BFS impact analysis: all affected files
bash scripts/import-graph.sh [dir]     — hot files: most-imported modules
bash scripts/audit-reuse.sh            — find duplication, suggest consolidation
```

## Команды
- `npm test` / `npm run lint` / `npm run typecheck` / `npm run dev`
- `python -m pytest` (backend)

## Правила

**Архитектурные:**
- Импорт ТОЛЬКО через `index.ts`. Нет прямых импортов из внутренних файлов.
- `core/` = чистые функции, нет IO
- `shared/` не зависит ни от кого
- `features/` зависит от `shared/` и `core/`
- Данные (`*.data.ts`) отделены от логики (`*.processor.ts`)
- Тесты рядом с кодом: `module.test.ts`
- ВСЕГДА: typecheck + lint + тесты модуля после изменений

## Design Work — HARD RULES (Figma, CSS, UI)
1. **NEVER hardcode visual values.** Use tokens/variables. Create tokens FIRST if missing.
2. **NEVER build from raw shapes.** Use components. Create components FIRST if missing.
3. **Build order: System→Tokens→Components→Screens.** NEVER skip to screens.
4. **Every container must have layout mode** (auto-layout / flexbox / grid).
5. **8 states**: Default, Hover, Active, Focus, Disabled, Loading, Error, Empty.
6. **Before creating**: search first — does it already exist?

Дизайн-система BUFF EAT:
- Warm editorial: cream (#FAF8F4), Playfair Display, terracotta (#A0522D)
- Токены: `src/shared/ui/tokens.ts`, компоненты: `src/shared/ui/`
- Inline styles (no Tailwind) — token-bound only

Full pipeline: `.claude/library/domain/domain-design-pipeline.md`

## Self-Improvement
After each correction: classify type (BUG/KNOWLEDGE_GAP/STYLE/DESIGN_DISAGREEMENT/MISUNDERSTANDING).
BUG or KNOWLEDGE_GAP → log to `tasks/lessons.md` with Track (BUG/KNOWLEDGE/PATTERN/PROCESS) + Severity (P0-P3).
When >50 entries → promote via `/weekly`.

Full: `.claude/library/process/self-improvement.md`

## Token Economy
- Trust skills/memory over re-reading. Don't re-read files you read this session.
- Only read files you WILL use. Parallelize independent tool calls.
- Route outputs >20 lines to subagents. After 2 failed corrections → /clear.
- Task switching → HANDOFF.md (status + files + next steps), fresh session.

## Pipelines
- Feature lifecycle: `.claude/pipelines/feature.md`
- Bugfix lifecycle: `.claude/pipelines/bugfix.md`
- Security patch: `.claude/pipelines/security-patch.md`

## Tasks
- Lessons learned: `tasks/lessons.md`
- Current task: `tasks/current.md`
- Goals: `tasks/goals.md`
- Queue: `tasks/queue.md`

## Commands (23)
/setup-project, /implement, /commit-push-pr, /review, /refactor, /sprint, /brain-sync, /weekly,
/status, /rollback, /onboard, /update-template, /hotfix, /retrospective, /sync-all,
/audit-tools, /mode-code, /mode-design, /mode-review, /mode-research, /mode-write, /mode-fix, /mode-plan

## Scaffolding
При создании нового модуля — СНАЧАЛА посмотри `templates/[тип]/` и используй как каркас.
Перед созданием: `.claude/library/technical/atomic-reuse.md` (search-before-create).

## Контекст по запросу
- `docs/BRD.md` — бизнес-требования v2, юзкейсы, bootstrap-корзины, math model
- `docs/DATA_DESIGN.md` — схема PostgreSQL
- `docs/ARCHITECTURE.md` — модули и зависимости, пайплайн двух систем
- `docs/EVIDENCE_BASE.md` — доказательная база + NutriScore в России
- `docs/DECISIONS.md` — ADR-001 — ADR-014
- `docs/API_CONTRACTS.md` — API контракты
- `_reference/README.md` — эталонные реализации

## DON'T
- Code files > 250 lines — split them (BUFF EAT stricter than template 375)
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

### BUFF EAT-specific DON'T
- Нутритивных утверждений без уровня уверенности ([RCT] / [SR/MA] / [i])
- Свопов вне одного convenience_tier и use_context
- Запрета любимых продуктов пользователя (Planned Indulgence) — weekly compensation only
- Смешивания NutriScore и Composite Score в один итоговый score
- Taste Engine в MVP (v1.5)
- Принудительного перехода между этапами прогрессивной модели

## Build & Test
```
npm run dev        — dev server
npm run build      — production build
npm run typecheck  — TypeScript type check
npm run lint       — ESLint
npm test           — Vitest run
```

## Compaction
After compaction: `bash scripts/context-restore.sh` to recover mode + task + rules.
Сохраняй: текущую задачу, изменённые файлы, результаты тестов, найденные проблемы.
Контекст двух MVP-систем: Quality Gate (NutriScore-2023 + NOVA) → Value Score (LP + Composite Score).

## Template Version
3.4.0 — Run `bash scripts/check-drift.sh` to verify health.
