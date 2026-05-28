<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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

