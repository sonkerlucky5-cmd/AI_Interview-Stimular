# 07 — Antigravity Master Prompt and End-to-End Acceptance Checklist

## 1. How to use
1. Put all seven numbered Markdown files plus `README_FIRST.md` in `docs/` at the project root.
2. Open the existing project in Antigravity.
3. Paste the prompt below.
4. Review the Phase 0 audit before approving implementation.
5. Implement one phase at a time; test and review before continuing.

## 2. Copy/paste master prompt

You are the senior full-stack engineer, UI/UX engineer, QA engineer and security reviewer for my existing AI_Interview-Stimular application.

### Mandatory reading
Read all files in `docs/`, especially:
- `README_FIRST.md`
- `01_PRD_and_Product_Requirements.md`
- `02_Architecture_and_Data_Flows.md`
- `03_PostgreSQL_Schema_and_Migrations.md`
- `04_API_Contracts_Security_and_Privacy.md`
- `05_Implementation_Testing_Deployment_Runbook.md`
- `06_UI_UX_Design_System_and_Responsive_Spec.md`
- `07_Antigravity_Master_Prompt_and_Acceptance_Checklist.md`

### Phase 0: audit only — do not edit files
Inspect the real repository, current routes, current UI, CSS/theme tokens, auth, API client, Express middleware, database schema/migrations, tests, environment examples, and deployment settings. Run baseline build/test/lint commands if safe and available. Record pre-existing failures.

Produce:
1. Actual stack and folder structure.
2. Current pages/routes and user journeys.
3. Feature status: implemented, partial, missing, blocked.
4. Existing design system versus document 06, including exact current colors/fonts where discoverable.
5. File-by-file proposed changes.
6. DB migration risks and safe rollout plan.
7. Security/privacy risks.
8. Test plan and acceptance criteria.
9. External providers/services needed and any costs/credentials/consent implications.
10. Implementation order and blockers.

Do not implement until I approve this audit.

### Implementation rules after approval
- Preserve working frontend, visual identity and API contracts. Do not rebuild the app or redesign unrelated pages.
- Apply document 06 consistently to new/modified screens; first audit the current design and migrate incrementally where necessary.
- Preserve existing working functionality, routes, authentication and responsive behavior.
- Never drop/reset tables or delete production/user data.
- Do not print or commit secrets; never request real secrets in chat. Use `.env.example` placeholders.
- Use safe additive migrations and test them on a disposable/staging database first.
- Never execute candidate code inside the Express API process. Keep DSA execution disabled until a separate isolated runner passes its security gate.
- Do not fake AI results, test output, analytics, microphone activity or completed features.
- Do not add a dependency, paid service, third-party API, tracking, recording or major architectural change without explaining its purpose and asking approval where needed.
- Keep all data access ownership-scoped; validate input on the server.
- Use real loading, empty, error, retry and success states.
- Implement keyboard access, visible focus, semantic labels, contrast, reduced motion and the responsive widths in document 06.
- Do not deploy, run destructive commands or perform irreversible actions without my explicit approval.

### Work in small phases
For each approved phase:
1. State exact scope and files expected to change.
2. Implement only that phase.
3. Run relevant tests/build/lint and report actual results.
4. Review regression/security/accessibility/responsive impact.
5. Fix issues before declaring phase done.
6. Summarize changes, migration commands, environment variables, test results and remaining limitations.
7. Wait for my approval before moving to the next major phase.

### End-to-end completion means
- Every required user journey works against the real backend and database.
- Existing auth and routes still work.
- No broken links/buttons/forms or fake data.
- All APIs validate/authenticate/authorize correctly.
- Private files/reports cannot be accessed by other users.
- Every screen has appropriate loading/empty/error states.
- UI matches document 06 and has been tested at all required widths.
- Unit/integration/e2e checks run where available; missing test infrastructure is reported.
- Build and deployment smoke tests pass.
- Secrets and sensitive content are not exposed.
- External services are live-tested or explicitly marked blocked/mock.
- Remaining limitations are listed honestly.

Start with Phase 0 only and wait for approval.

## 3. Route-by-route UI QA checklist

For each current and new route, check:
- [ ] Correct page title and active navigation.
- [ ] No console errors or failed unexpected API calls.
- [ ] Loading, empty, error and success states.
- [ ] Keyboard navigation and visible focus.
- [ ] Form labels, validation and preserved values after errors.
- [ ] Contrast/status labels and screen-reader names.
- [ ] No horizontal overflow at 320, 360, 375, 390, 414, 430, 600, 768, 820, 900, 1024, 1280, 1366, 1440, 1600, 1920 and 2560px.
- [ ] Long content wraps; dialogs fit; charts/tables/code areas remain usable.
- [ ] Unauthorized/cross-user API attempts are rejected.
- [ ] Existing behavior is preserved.

## 4. Feature completion matrix

| Feature | Backend/data | UI states | Security/privacy | Tests | Status |
|---|---|---|---|---|---|
| Resume upload/parsing | Verify | Verify | Verify | Verify | Fill after audit |
| Job descriptions | Verify | Verify | Verify | Verify | Fill after audit |
| Resume matching | Verify | Verify | Verify | Verify | Fill after audit |
| Adaptive interview | Verify | Verify | Verify | Verify | Fill after audit |
| Answer evaluation | Verify | Verify | Verify | Verify | Fill after audit |
| History/analytics | Verify | Verify | Verify | Verify | Fill after audit |
| DSA catalogue | Verify | Verify | Verify | Verify | Fill after audit |
| Isolated DSA execution | Must pass security gate | Verify | Critical | Security tests | Disabled until verified |
| Voice interview | Verify | Verify | Consent/fallback | Verify | Fill after audit |
| PDF report | Verify | Verify | Ownership/private access | Verify | Fill after audit |
| Learning roadmap | Verify | Verify | Ownership | Verify | Fill after audit |
| Responsive/accessibility | N/A | All routes | N/A | Manual/automated | Fill after audit |

## 5. Final response format required from Antigravity
- What changed and why.
- Files created/modified/preserved.
- Routes and APIs added/reused.
- Migrations and safe commands.
- Environment variable names only, with placeholders.
- Tests/build/lint actually run and their results.
- Responsive viewport matrix with pass/fail and issues.
- Security/privacy review and outstanding risks.
- Integrations actually tested versus mocked/blocked.
- Deployment steps, recovery notes and remaining manual actions.
- Feature completion matrix: implemented / partial / blocked / not started.
