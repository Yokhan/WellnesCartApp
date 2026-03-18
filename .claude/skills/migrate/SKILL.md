---
name: migrate
description: "Database migration management — generate, validate, apply, rollback. Trigger on: schema change, new table, migration, alter column."
---

# Database Migration Skill

## When to use
Schema changes: new tables, column additions/modifications, index changes, data migrations.

## Steps

### Step 1 — Understand the change
- What schema change is needed?
- Is this additive (safe) or destructive (risky)?
- How many rows affected by data migration?

### Step 2 — Generate migration
- Use project's migration tool (Prisma, Alembic, golang-migrate, sqlx)
- Name format: `YYYYMMDD_HHMMSS_descriptive_name`
- Include both `up` and `down` migrations

### Step 3 — Validate
- Is it idempotent? (safe to run twice)
- Is it backward-compatible? (old code still runs against new schema)
- Does it have a tested rollback path?
- For large tables (>100K rows): does it use online DDL or lock the table?

### Step 4 — Dry run
- Run against dev/staging environment first
- Measure execution time
- Verify row counts and data integrity after

### Step 5 — Document
- Add to `brain/04-decisions/migrations/YYYYMMDD-description.md`: why, what, impact, rollback plan
- Update `docs/DATA_DESIGN.md`

### Step 6 — Apply
- Apply to target environment
- Verify with spot-check queries
- Monitor error rates for 5 minutes after

## Rules
- Never `DROP COLUMN` without deprecation period: null → stop writing → confirm unused → then drop
- Never run migrations during peak traffic without online DDL support
- Always test rollback before applying to production
- Data migrations > 1M rows: run in batches with progress logging
