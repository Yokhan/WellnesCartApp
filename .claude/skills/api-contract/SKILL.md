---
name: api-contract
description: "Validate API implementations against contracts in docs/API_CONTRACTS.md. Trigger when API endpoints change or user asks to verify API."
---

# API Contract Validation Skill

Ensure API implementations match documented contracts.

## Process

### Phase 1: Load Contracts
1. Read `docs/API_CONTRACTS.md`
2. Parse each endpoint: method, path, request schema, response schema, status codes

### Phase 2: Find Implementations
1. Search codebase for route definitions matching documented paths
2. Map each contract to its implementation file

### Phase 3: Validate
For each endpoint:
- **Request schema**: Does implementation validate all required fields?
- **Response schema**: Does implementation return all documented fields?
- **Status codes**: Are all documented error codes handled?
- **Types**: Do TypeScript/Python types match the contract?

### Phase 4: Report Mismatches
For each mismatch:
1. Show contract vs implementation
2. Ask user: update CONTRACT or update CODE?
3. Apply the chosen fix

### Phase 5: Generate Missing Contracts
If implementation exists but no contract:
1. Analyze the endpoint implementation
2. Generate contract entry for docs/API_CONTRACTS.md
3. Include: method, path, request/response schemas, status codes

### Phase 6: Generate OpenAPI Spec
If `docs/openapi.yaml` doesn't exist:
1. Use contracts from `docs/API_CONTRACTS.md` as source of truth
2. Generate `docs/openapi.yaml` with: paths, methods, request/response schemas, status codes, auth requirements
3. Validate generated spec against implementation

## Sync with Tests
After contract changes:
1. Check if integration tests exist for the endpoint
2. Verify tests match updated contract
3. Flag untested endpoints
