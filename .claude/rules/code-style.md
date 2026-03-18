# Code Style Rules (Stack-Agnostic)

## Immutability
- Prefer returning new objects over mutating existing ones.
- Use const/final/let (not var/mutable) by default.
- If mutation is necessary, document why.

## Type Safety
- No `any` (TypeScript), no `object` (Python), no `interface{}` (Go old-style).
- Use `unknown` + type guards, generics, or proper typing.
- Define explicit types for all public function signatures.
- Go: avoid `any` without type constraints (use generics). Rust: avoid `Box<dyn Any>`, prefer typed enums.

## Naming
- Functions: verb + noun (getUser, calculateScore, validateInput)
- Booleans: is/has/can/should prefix (isActive, hasPermission)
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case or snake_case (match language convention)

## Functions
- Single responsibility: one function does one thing.
- Max 30 lines per function. Longer = split into helpers.
- Pure functions preferred: same input = same output, no side effects.
- Error handling at boundaries, not deep inside.

## Logging & Observability
- Use structured logging (JSON format).
- Log levels: debug (dev only), info (events), warn (recoverable issues), error (failures).
- Include correlation IDs.
- Never log PII (emails, passwords, tokens).

## Async Patterns
- async/await by default.
- Streams only for large data volumes (>10MB or continuous).
- Never use callbacks (except legacy API adapters).
- Avoid nested async without explanation.

## Configuration
- All config via environment variables (12-factor).
- Validate and type config at startup.
- No hardcoded URLs, ports, or credentials.
- Use typed config objects, never raw `process.env.X` scattered in business logic.

## Comments
- Don't comment WHAT (the code shows that). Comment WHY.
- No commented-out code. Delete it (git has history).
- TODO format: `// TODO(context): description`
