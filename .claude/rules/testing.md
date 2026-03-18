# Testing Rules

## Test Location
- Tests colocated with source code: `module.test.ts`, `test_module.py`, `module_test.go`
- Integration tests in `tests/integration/`
- E2E tests in `tests/e2e/`

## Test Independence
- Each test is fully independent. No shared mutable state between tests.
- Use factory functions for test data, not hardcoded objects.
- Setup/teardown per test, not per suite (unless expensive resources).

## Test Structure
- Arrange → Act → Assert (AAA pattern)
- One assertion concept per test (multiple asserts OK if testing same concept)
- Test name describes the scenario: `should_return_error_when_input_is_empty`

## What to Test
- Pure functions: input/output pairs, edge cases, error cases
- For pure functions with wide input space: property-based tests with fixed seed
- Async code: test both success and error paths
- Public API only. Don't test private internals.

## What NOT to Test
- Framework code (React renders, Express routing)
- Simple getters/setters
- Type system (that's what typecheck is for)

## Test Execution
- ALWAYS run relevant tests after making changes
- Fix failing tests before committing
- Never commit with known test failures

## Coverage Thresholds
- `core/` — 90% minimum.
- `features/` — 80% minimum.
- `adapters/` — 60% minimum (IO is hard to unit test).
- `shared/` utilities — 95% minimum.
- Property-based tests for pure functions with >3 parameters.

## Snapshot Tests
- Use ONLY for serialized outputs (JSON responses, HTML templates, CLI output).
- Never for business logic.
- Always review snapshot diffs — never run `--update-all` blindly.
- Snapshots must be deterministic (no dates, UUIDs, random values).
