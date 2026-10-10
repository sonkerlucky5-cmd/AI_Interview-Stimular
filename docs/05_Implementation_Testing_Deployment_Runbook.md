# 05 — Implementation, Testing and Deployment Runbook

## 1. Mandatory phases

### Phase 0 — Audit only (no edits)
- Inspect repository tree, package scripts, routes, shared components, API client, auth, DB connection, migrations, tests, `.env.example`, `.gitignore`, hosting and current UI.
- Run baseline build/tests/lint if available; record pre-existing failures.
- Read all documentation files.
- Produce a file-by-file gap analysis and proposed implementation order.
- Wait for approval.

### Phase 1 — Foundation
- Verify database and auth assumptions.
- Add/repair common validation, errors, request IDs and safe logging.
- Define migration strategy and tests.
- Verify existing login/logout/session persistence.

### Phase 2 — Resume and job matching
- Secure upload, private storage, parsing, job-description CRUD and matching.
- Add UI integration and loading/error states.

### Phase 3 — Mock interview and evaluation
- Session lifecycle, bounded question generation, answer persistence, rubric evaluation, adaptive follow-ups and idempotency.
- Add resume/reload recovery and completion screen.

### Phase 4 — History, analytics and PDF
- Paginated history, metric definitions, detail pages and secure reports.

### Phase 5 — Learning roadmap
- Plan generation, edit/progress controls, regeneration preserving completed work.

### Phase 6 — Voice
- Choose browser or provider speech only after compatibility/privacy review.
- Keep text mode functional and verify denied/unsupported states.

### Phase 7 — DSA
- Build catalogue and submission workflow.
- Execution remains off until isolated runner security gate passes.

### Phase 8 — UI polish and responsive/accessibility audit
- Apply design system in document 06 consistently.
- Test all existing and new routes at all required viewports.
- Fix overflow, focus, contrast, keyboard and reduced-motion issues.

### Phase 9 — Release hardening
- Run tests, security checks, build/lint, staging smoke tests, backup/restore and deployment validation.

## 2. Definition of done per feature
- Existing UI and route contracts preserved unless approved.
- Server-side authorization and validation implemented.
- Database changes use safe migrations.
- Unit/integration tests added and actually run.
- Frontend build and backend tests pass, or pre-existing failures are clearly separated.
- Loading, empty, success, retry, permission and error states handled.
- Responsive and keyboard checks pass.
- `.env.example` and documentation updated.
- No secrets/private user content in logs.
- External integrations tested live or explicitly marked mocked/blocked.
- Acceptance criteria and known limitations documented.

## 3. Test strategy

### Unit tests
Validators, parser adapter, matching normalization, interview state transitions, adaptive question limits, evaluation schema, analytics calculations, roadmap validation and report assembly.

### Integration tests
Protected routes, repository queries, migrations, ownership, upload/delete, interview lifecycle, duplicate submissions, PDF access and roadmap progress.

### Frontend tests
Critical component states, route guards, API errors, forms, transcript review, code execution unavailable state, keyboard interaction and responsive layout.

### End-to-end smoke tests
1. Register/login/logout and refresh session.
2. Upload valid resume; reject invalid and oversized files.
3. Create/edit/delete a job description.
4. Run match and inspect evidence/gaps.
5. Start interview; answer several questions; refresh; resume.
6. Verify evaluation and follow-up question.
7. Complete session and inspect history/analytics.
8. Generate/download report; try cross-user access.
9. Create learning plan; edit and complete task; regenerate.
10. Deny microphone and verify text fallback.
11. If runner is approved/enabled, test correct/incorrect code, syntax error, timeout and resource limits.
12. Test every existing/new route on mobile/tablet/desktop.
13. Run production build and deployment smoke test.

## 4. Environment management
Actual variable names must match the codebase; this is illustrative only.
```dotenv
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://DB_USER:URL_ENCODED_PASSWORD@localhost:5432/ai_interview_simulator
JWT_SECRET=replace_with_a_long_random_secret
AI_PROVIDER=replace_me
AI_API_KEY=replace_me
FRONTEND_ORIGIN=http://localhost:5173
UPLOAD_MAX_BYTES=10485760
FILE_STORAGE_MODE=local
FILE_STORAGE_PATH=./private-uploads
CODE_RUNNER_URL=
CODE_RUNNER_TOKEN=
```
- Never commit `.env`.
- Never ask the user to paste real secrets into chat or documentation.
- URL-encode reserved characters in PostgreSQL URI passwords.
- Do not add unused variables.
- Vite client variables are public; never place secrets in `VITE_*`.

## 5. Deployment checklist
- Frontend API base URL points to deployed API, not local machine.
- Backend can reach production PostgreSQL over TLS where supported.
- Database network access and credentials follow least privilege.
- CORS, cookie settings and allowed origins match actual domains.
- Private storage persistence and access are verified.
- Migrations are applied in a reviewed order.
- Health check, error monitoring and request IDs work.
- Backups and restore procedure are verified.
- DSA execution is disabled unless isolated runner gate passes.
- Smoke tests run after deployment; rollback/recovery plan is recorded.

## 6. Final implementation report
Agent must report:
1. Implemented / partial / blocked / not started for each feature.
2. Files added, modified and preserved.
3. Migrations and safe commands used.
4. Endpoints added/reused.
5. Tests actually run and results.
6. Build/lint results.
7. Security controls and unresolved risks.
8. Integrations live-tested vs mocked/unavailable.
9. UI/responsive/accessibility checks and viewport results.
10. Environment variables (names and placeholders only).
11. Deployment and recovery steps.
12. Remaining manual tasks and recommended next step.

Never claim “100% complete” without evidence. No real system can guarantee zero defects; report verified scope and limitations honestly.
