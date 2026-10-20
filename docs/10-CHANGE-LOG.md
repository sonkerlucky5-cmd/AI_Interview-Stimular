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



