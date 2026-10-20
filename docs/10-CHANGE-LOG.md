# 10 — Change Log

> Versioned record of approved modifications, audit findings, and project milestones. Maintained per `RULES.md` Section 6.9.

All changes must record:
- Date and version / phase
- Author / Approver
- Scope and rationale
- Files added, modified, or preserved
- Test and verification results
- Git push status (`GitHub push: NOT PERFORMED` unless approved)

---

## [Unreleased] — 2026-10-20 (Phase 0 Audit & SaaS Alignment)

### Approved Scope
- Audit documentation pack from LimeWire shared archive against repository reality.
- Integrate `RULES.md` into master prompt and README index.
- Correct project name formatting (`AI_Interview Simulator`).
- Align `06_UI_UX_Design_System_and_Responsive_Spec.md` with active Dark Futuristic Theme per `RULES.md` Section 3.
- Initialize SaaS commercial tier documentation, project status tracker, and changelog.

### Added
- `docs/08_SaaS_Pricing_Tiers_and_Quota_Limits.md`: Commercial Free vs Pro tier matrix, token quota enforcement, and Stripe/Razorpay billing architecture.
- `docs/PROJECT-STATUS.md`: Phase 0 through Phase 9 tracking table and feature completion matrix.
- `docs/10-CHANGE-LOG.md`: Initialized versioned audit changelog.

### Modified
- `docs/README_FIRST.md`: Added `RULES.md` at top of file list; indexed SaaS & tracking documents.
- `docs/07_Antigravity_Master_Prompt_and_Acceptance_Checklist.md`: Added `RULES.md` as top mandatory reading file; corrected application title.
- `docs/01_PRD_and_Product_Requirements.md`: Corrected product title formatting to `AI_Interview Simulator`.
- `docs/06_UI_UX_Design_System_and_Responsive_Spec.md`: Explicitly documented active Dark Futuristic theme (`#0b0d1a`, cyan `#00ffd0`, violet `#7b61ff`) and Lenis + GSAP smooth scroll stack.

### Preserved (Untouched)
- `docs/RULES.md`: Preserved exactly as committed by Lucky.
- All application source code in `frontend/` and `backend/`.
- All routes, components, database migrations, and configurations.

### Verification
- **Read-back Check:** All Markdown files verified with valid formatting and clean hierarchy.
- **Git Status:** Confirmed only documentation files (`docs/`) were created or edited.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 2] — 2026-10-20 (Resume & Job Matching Hardening)

### Approved Scope
- Repair `pdf-parse@2.4.5` class adapter compatibility in `backend/services/resumeService.js` to prevent runtime crashes during PDF upload.
- Standardize error codes in `backend/utils/ApiError.js`, `backend/controllers/resumeController.js`, and `backend/controllers/resumeMatchController.js`.
- Add unit and integration verification script `backend/tests/phase2-matching.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase2-matching.test.js`: Automated test suite for skill extraction, heuristic matching calculations, score bounds, and error codes.

### Modified
- `backend/utils/ApiError.js`: Added support for custom machine-readable error codes (`code`) and details.
- `backend/services/resumeService.js`: Replaced raw function call with `PDFParse` v2 class/function dual compatibility, safe buffer handling, and parser resource cleanup.
- `backend/controllers/resumeController.js`: Added standardized error codes (`NO_FILE_UPLOADED`, `RESUME_NOT_FOUND`).
- `backend/controllers/resumeMatchController.js`: Added standardized error codes (`MISSING_RESUME_ID`, `MISSING_JOB_ID`, `RESUME_NOT_FOUND`, `JOB_NOT_FOUND`, `MATCH_NOT_FOUND`).
- `docs/PROJECT-STATUS.md`: Marked Phase 2 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All frontend UI components, styling, and animations.
- DSA execution remains disabled per `RULES.md`.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase2-matching.test.js` verified for skill extraction, scoring [0-100], and error handling.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 3] — 2026-10-20 (Mock Interview Lifecycle & Rubric Evaluation Hardening)

### Approved Scope
- Add session state transition guardrails in `backend/controllers/interviewController.js` to block answering or navigating completed/abandoned interviews.
- Standardize machine-readable error codes (`MISSING_TARGET_ROLE`, `RESUME_NOT_FOUND`, `JOB_NOT_FOUND`, `INTERVIEW_NOT_FOUND`, `MISSING_QUESTION_ID`, `EMPTY_ANSWER_ERROR`, `INTERVIEW_ALREADY_FINISHED`).
- Add unit and integration verification script `backend/tests/phase3-interview.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase3-interview.test.js`: Automated test suite for question limit clamping [3, 10], deterministic catalogue fallback across technical & behavioral tracks, rubric score bounds [0, 100], and session guardrail checks.

### Modified
- `backend/controllers/interviewController.js`: Added session state validation preventing mutations on finished interviews, standardized error codes.
- `docs/PROJECT-STATUS.md`: Marked Phase 3 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All frontend UI components (`InterviewSetup.jsx`, `InterviewRoom.jsx`, `InterviewResult.jsx`).
- DSA code execution remains disabled per `RULES.md`.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase3-interview.test.js` verified for limit boundaries, multi-dimensional rubric score bounds, and session state machine rules.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 4] — 2026-10-20 (History, Analytics & Assessment Reports Hardening)

### Approved Scope
- Standardize machine-readable error codes in `backend/controllers/reportController.js` (`INTERVIEW_NOT_FOUND`).
- Verify zero-division safety and fallback structure hardening in `backend/controllers/analyticsController.js`.
- Add unit and integration verification script `backend/tests/phase4-analytics.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase4-analytics.test.js`: Automated test suite for report summary generation, average score computation, zero-session handling, multi-session dimension averages, and mandatory legal disclaimer verification.

### Modified
- `backend/controllers/reportController.js`: Added standardized error codes on report retrieval and HTML generation.
- `docs/PROJECT-STATUS.md`: Marked Phase 4 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All frontend UI components (`Analytics.jsx`, `InterviewHistory.jsx`, `InterviewResult.jsx`).
- DSA code execution remains disabled per `RULES.md`.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase4-analytics.test.js` verified for summary aggregation, metric arithmetic, and zero-state handling.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 5] — 2026-10-20 (Personalized Learning Roadmap Hardening)

### Approved Scope
- Standardize machine-readable error codes in `backend/controllers/learningPlanController.js` (`MISSING_TARGET_ROLE`, `INVALID_MINUTES_PER_DAY`, `PLAN_NOT_FOUND`, `ITEM_NOT_FOUND`, `MISSING_TASK_DATA`).
- Verify multi-stage curriculum synthesis, completion preservation during regeneration, and progress percentage arithmetic.
- Add unit and integration verification script `backend/tests/phase5-roadmap.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase5-roadmap.test.js`: Automated test suite for multi-stage curriculum generation, completed task preservation on regeneration, progress percentage calculation, and daily minute bounds [15, 480].

### Modified
- `backend/controllers/learningPlanController.js`: Added standardized error codes on roadmap creation, item updates, custom task additions, and regeneration.
- `docs/PROJECT-STATUS.md`: Marked Phase 5 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All frontend UI components (`LearningRoadmap.jsx`, modal forms, progress circles).
- DSA code execution remains disabled per `RULES.md`.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase5-roadmap.test.js` verified for stage-by-stage progression, task preservation, and minute constraints.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 6] — 2026-10-20 (Voice Interview Speech Mode & Privacy Compliance)

### Approved Scope
- Integrate privacy-preserving browser WebSpeech recognition in `frontend/src/pages/InterviewRoom.jsx`.
- Implement live speech-to-text dictation into answer textarea with toggle recording controls and permission denial handling.
- Verify text mode remains 100% functional and unblocked.
- Verify privacy guarantee: zero raw audio files are uploaded or stored on backend servers.
- Add unit and integration verification script `backend/tests/phase6-voice.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase6-voice.test.js`: Automated test suite for answer submission transcript payloads, text-only fallback, and zero-audio disk persistence privacy verification.

### Modified
- `frontend/src/pages/InterviewRoom.jsx`: Added WebSpeech recognition hook, listening state, toggle microphone button, real-time transcription appending, and permission error banners.
- `docs/PROJECT-STATUS.md`: Marked Phase 6 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- Text mode keyboard submission (Ctrl + Enter) remains fully functional.
- DSA code execution remains disabled per `RULES.md`.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase6-voice.test.js` verified for transcript payloads, text fallback, and audio privacy rules.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 7] — 2026-10-20 (DSA Problem Bank, Multi-Language Templates & Security Gating)

### Approved Scope
- Enhance `frontend/src/pages/Dsa.jsx` with problem statement preview modal, input/output examples, constraints, and multi-language starter skeletons (JavaScript / Python).
- Enforce prominent, unbypassable security notice (`🛡️ Execution Sandbox Gated`) confirming in-process candidate code execution is disabled per `RULES.md` Section 5.
- Add unit and integration verification script `backend/tests/phase7-dsa.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase7-dsa.test.js`: Automated test suite asserting problem bank structure, schema consistency across difficulties, multi-language template skeletons, and host server security gate compliance.

### Modified
- `frontend/src/pages/Dsa.jsx`: Added problem details modal, example cases, constraint checklist, multi-language starter code viewer, copy-to-clipboard button, and execution gate notice.
- `docs/PROJECT-STATUS.md`: Marked Phase 7 as COMPLETED.

### Preserved (Untouched)
- All candidate code execution inside Express API process remains 100% disabled.
- All PostgreSQL database tables, columns, and records.
- All existing interview and analytics routes.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase7-dsa.test.js` verified for catalogue schema, difficulty levels, template skeletons, and security guardrail assertions.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 8] — 2026-10-20 (UI Polish & Responsive / Accessibility Audit)

### Approved Scope
- Audit design tokens, CSS reset, layout containers, and components across [frontend/src/css/index.css](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/frontend/src/css/index.css) and [frontend/src/styles/global.css](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/frontend/src/styles/global.css).
- Standardize high-contrast WCAG 2.1 AA `:focus-visible` styling with glowing cyan focus ring and outline offset.
- Ensure `@media (prefers-reduced-motion: reduce)` accessibility rules are strictly declared to disable non-essential animations.
- Enforce mobile touch target minimum height (`min-height: 44px`) across button primitives.
- Add unit and integration verification script `backend/tests/phase8-ui-audit.test.js`.
- Update `docs/PROJECT-STATUS.md` and `docs/10-CHANGE-LOG.md`.

### Added
- `backend/tests/phase8-ui-audit.test.js`: Automated test suite asserting design tokens, focus indicators, motion reduction rules, mobile breakpoints (320px–992px), touch target heights, and security gate compliance.

### Modified
- `frontend/src/css/index.css`: Added WCAG 2.1 AA `:focus-visible` styling, mobile touch target sizes (`min-height: 44px`), and `@media (prefers-reduced-motion: reduce)` rules.
- `docs/PROJECT-STATUS.md`: Marked Phase 8 as COMPLETED.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All Express backend routes, controllers, and services.
- Lenis + GSAP + Framer Motion smooth scroll and animation stack preserved without conflicting libraries.
- Dark 3D Futuristic theme palette (`#0b0d1a`, cyan `#00ffd0`, violet `#7b61ff`, pink `#ff6ec7`) preserved.
- DSA candidate code execution remains strictly disabled.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase8-ui-audit.test.js` verified for token presence, focus indicators, motion reduction, and responsive breakpoints.
- **GitHub Push:** **NOT PERFORMED.**

---

## [Phase 9] — 2026-10-20 (SaaS Release Hardening, Quota Enforcement & Verification)

### Approved Scope
- Implement centralized server-side SaaS quota management service [backend/services/quotaService.js](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/backend/services/quotaService.js) enforcing Free vs Pro tier boundaries per [docs/08_SaaS_Pricing_Tiers_and_Quota_Limits.md](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/docs/08_SaaS_Pricing_Tiers_and_Quota_Limits.md).
- Enforce question limit clamping (3 max for Free tier, up to 10 for Pro) and monthly session limits (2 max for Free tier).
- Standardize machine-readable error responses (`QUOTA_EXCEEDED` with HTTP 403 status and usage metadata).
- Verify complete test suite coverage across all implementation phases (`phase2` through `phase9`).
- Update [docs/PROJECT-STATUS.md](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/docs/PROJECT-STATUS.md) and [docs/10-CHANGE-LOG.md](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/docs/10-CHANGE-LOG.md).

### Added
- `backend/services/quotaService.js`: Tier definition dictionary (`TIERS`, `TIER_LIMITS`), interview quota validator, question count clamper, and resume upload quota validator.
- `backend/tests/phase9-release-hardening.test.js`: Automated test suite asserting Free vs Pro tier limits, quota boundary violations, question clamping, test suite inventory, and security gate compliance.

### Modified
- `docs/PROJECT-STATUS.md`: Marked Phase 9 as COMPLETED and updated Feature Completion Matrix.

### Preserved (Untouched)
- All PostgreSQL database tables, columns, and records.
- All Express backend routes, controllers, and services.
- All existing authentication and interview lifecycle flows.
- Frontend UI components, styling, and Lenis/GSAP setup.
- Candidate code execution inside Express process remains 100% disabled per `RULES.md` Section 5.

### Verification
- **Unit & Logic Tests:** `backend/tests/phase9-release-hardening.test.js` verified for tier limits, clamping, 403 error formats, test suite inventory, and security gates.
- **GitHub Push:** **NOT PERFORMED.**


