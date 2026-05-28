<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

> **CRITICAL: Before any git operation (commit, push, merge, rebase, etc.), RE-READ this AGENTS.md file and follow the Git Guidelines section below. Before any API integration work, RE-READ the API Integration Rules section. Do not proceed without verifying you have reviewed the applicable rules.**

# Git Guidelines

Commit frequently and intentionally throughout development. Small, focused commits are easier to review, revert, and understand than large monolithic ones.

## When to Commit
- After completing any small but significant unit of work (a function, a component, a bug fix, a passing test).
- After resolving a lint or type error.
- After any refactor that leaves the codebase in a working state.
- Before starting a new, unrelated change.
- At any logical checkpoint where the project builds and tests pass.

## Commit Message Style
- Write concise, imperative-tense summaries (e.g., "Fix login redirect", "Add project list pagination").
- Provide context in the body when the change is non-obvious: what the problem was and how it was solved.
- Use conventional prefixes when applicable (e.g., `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).

## Commit Hygiene
- Don't stage unrelated changes together; make separate commits for separate concerns.
- Never commit secrets, environment files, or generated artifacts.
- Review `git diff --staged` before committing to ensure you're committing exactly what you intend.

# API Integration Rules — Backend OpenAPI Spec

The backend exposes a live OpenAPI 3.1 spec at:

```
GET {BACKEND_URL}/api/openapi.json
```

The `BACKEND_URL` is configured via the `NEXT_PUBLIC_API_URL` environment variable (see `.env.example`).

This spec is the **single source of truth** for all API calls. Never guess or assume endpoint shapes.

## Workflow

1. **Fetch the spec first** — before writing any API code, run:
   ```bash
   curl $NEXT_PUBLIC_API_URL/openapi.json | jq . > /tmp/openapi.json
   ```
   or fetch it programmatically. Read it to understand available endpoints.

2. **Generate from spec** — derive all TypeScript types, API client functions, and validation schemas from the OpenAPI spec:
   - Use `components.schemas` for data types (request bodies, response shapes).
   - Use `paths` for exact HTTP methods, URLs, query params, and request bodies.

3. **Respect auth** — the spec's `security` array on each operation tells you whether it requires `Authorization: Bearer <token>`. Never send tokens to unauthenticated endpoints or omit them from secured ones.

4. **Respect role requirements** — each endpoint's `description` field mentions required roles (e.g., "Requires admin or manager"). Gate UI elements and API calls accordingly.

5. **Handle errors from spec** — use the `ErrorResponse` schema from the spec to type error handlers. The backend returns:
   ```json
   { "error": "...", "status": 400, "details": "...", "stack": "..." }
   ```

6. **Re-fetch on changes** — whenever you are told the backend has changed, or if an API call returns unexpected errors, re-fetch `/api/openapi.json` before debugging. Do not fix frontend code against a stale spec.

7. **Keep generated code in sync** — if you generate an API client file (e.g., `api-client.ts`), always regenerate it from the latest spec rather than patching it manually. Never hand-edit generated types to match what you think the backend does.

