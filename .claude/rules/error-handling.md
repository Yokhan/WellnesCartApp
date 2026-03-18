# Error Handling Rules

## Strategy
- Use Result/Either pattern for expected failures (validation errors, not-found, etc.)
- Use exceptions/panics ONLY for truly unexpected states (programmer errors)
- Never throw in core/ modules — return typed errors
- Catch errors at system boundaries (HTTP handlers, CLI entry points, message consumers)

## Typed Errors
- Define explicit error types per domain (AuthError, ValidationError, NotFoundError)
- Include context: error code, message, original cause
- No raw strings as error messages in production code

## Error Logging
- Log at the boundary where you catch, not where you throw
- Include: correlation ID, stack trace (in debug mode), input context (sanitized)
- Never swallow errors silently (`catch {}` with no logging is forbidden)

## Recovery
- Always define recovery path: retry, fallback, fail-fast, or user notification
- Transient failures: retry with exponential backoff (max 3 attempts)
- Permanent failures: fail fast, log clearly, return typed error
