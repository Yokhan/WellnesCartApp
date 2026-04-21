# Implement Feature

Реализуй фичу по утверждённому плану, следуя feature pipeline.

## Pipeline
Полный пайплайн: `.claude/pipelines/feature.md`
Bugfix пайплайн: `.claude/pipelines/bugfix.md`

## Порядок действий:

### Phase 1: Research
1. Прочитай план (если есть plan.md или задачу из контекста)
2. Прочитай `docs/BRD.md` — найди релевантные RF и UC
3. Прочитай `docs/DATA_DESIGN.md` — найди релевантные таблицы
4. Прочитай `docs/ARCHITECTURE.md` — пойми где в пайплайне находится фича
5. Прочитай `tasks/lessons.md` — есть ли уроки по похожим задачам?
Подробности: `.claude/library/process/research-first.md`

### Phase 2: Plan
6. Для задач M+ — составь план перед кодом
Подробности: `.claude/library/process/plan-first.md`

### Phase 3: Implement
7. Посмотри `_reference/README.md` — есть ли эталон для этого паттерна
8. Посмотри `templates/feature/` — используй как каркас
9. Проверь naming conflicts: `.claude/library/technical/atomic-reuse.md`
10. Реализуй фазу за фазой
11. Каждые 3-4 файла: `npm run typecheck` (batch typecheck)

### Phase 4: Verify
12. `npm run typecheck && npm run lint && npm test`
13. Файл < 250 строк?
14. Свопы только внутри convenience_tier + use_context?
15. Self-review через доменные линзы: `.claude/library/process/self-verification.md`

### Phase 5: Commit
16. Осмысленное сообщение коммита
17. Запиши уроки если были: `tasks/lessons.md`
