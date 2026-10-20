# 01 — Product Requirements Document

## 1. Product vision

AI_Interview Simulator (GitHub repo: `AI_Interview-Stimular`) is a candidate-first practice platform for preparing for software and other job interviews. It should help users understand role requirements, practise realistic interviews, receive evidence-based feedback, review progress, practise DSA safely, and follow a personalized learning plan.


**Product promise:** structured practice and actionable feedback—not a guaranteed job offer, hiring prediction, or professional certification.

## 2. Product principles

- Preserve the existing React + Vite frontend, Express/Node backend, PostgreSQL database, current routing and working authentication unless the repository audit demonstrates a concrete reason to change them.
- Ship in small, reviewable phases. Do not rewrite the whole application.
- Every feature needs loading, empty, success, failure, retry and permission-denied states as applicable.
- Make AI-generated feedback explainable, bounded, editable where appropriate, and clearly labelled as AI-generated.
- Keep resumes, transcripts, answers, reports and generated artifacts private.
- Use accessible, responsive UI, including keyboard navigation and reduced-motion support.
- Avoid dark patterns, fake scores, fake interview results and fabricated analytics.
- Do not infer emotion, personality, intelligence or competence from face or voice.
- Never execute untrusted candidate code inside the API server.

## 3. User roles

### Candidate
- Manages profile and target roles.
- Uploads and deletes resumes.
- Creates job descriptions and resume matches.
- Starts, resumes, completes and abandons mock interviews.
- Reviews evaluations, history, analytics and PDF reports.
- Practices DSA when a secure runner is available.
- Uses optional voice mode after permission and consent.
- Creates and edits learning plans.

### Administrator (only if admin functionality exists or is explicitly approved)
- Manages platform-level configuration, curated question catalogue and operational monitoring.
- Must not casually access private candidate resumes, answers or transcripts.
- All privileged actions must be authorized and auditable.
- Do not create an admin role or admin console without confirming the existing product needs and current auth model.

## 4. Required features and acceptance criteria

### 4.1 Resume upload and parsing
- Support only explicitly configured formats, initially PDF and DOCX if parsers work reliably.
- Validate extension, MIME type, file signature, size, parseability and ownership.
- Store uploads privately using generated storage keys.
- Show processing state and clear errors; never claim a parse succeeded if it failed.
- Allow users to inspect extracted text/skills and delete their resume.
- Do not expose storage paths or private object URLs publicly.

### 4.2 Job description management
- Allow a candidate to create, view, edit and delete their own job descriptions.
- Capture title, company (optional), description, required skills and experience expectations.
- Normalize and validate input length.
- Treat pasted job descriptions as untrusted content, not system instructions.

### 4.3 Resume-to-job matching
- Show a transparent match summary, matched skills, likely gaps, evidence from the resume and suggestions.
- Separate exact evidence from inferred skills.
- Explain that any score is a heuristic, not a hiring probability.
- Persist the resume version, job-description version, match result and model/rule version.
- Provide loading, retry and provider-error states.

### 4.4 Adaptive mock interview
- Let users select target role, interview type, difficulty, language, duration/question count and optional job/resume context.
- Persist session state and each question/answer.
- Use a bounded question count and explicit session state transitions.
- Adapt follow-up questions based on topic coverage and answer quality, without looping indefinitely.
- Support refresh/resume and safe duplicate-submission handling.
- Clearly distinguish active, completed, abandoned and failed sessions.

### 4.5 Answer evaluation and ideal answer
Each evaluation should include:
- Overall rubric score and category scores, with a documented scale.
- Strengths supported by evidence from the submitted answer.
- Missing concepts and concrete improvements.
- A sample/ideal answer labelled as one possible example, not the only valid answer.
- A follow-up practice suggestion.
- Model and rubric version for auditability.
- A graceful fallback when the AI provider fails.

Suggested rubric dimensions (configurable by interview type):
- Relevance to the question
- Technical correctness
- Completeness/depth
- Reasoning/problem-solving
- Clarity/structure
- Practical examples/trade-offs

Do not score accent, appearance, perceived emotion, or personality.

### 4.6 Interview history and analytics
- Paginated history with filters by date, role, interview type and status.
- Overview cards with definitions and empty states.
- Skill trends based only on real saved evaluations.
- Separate completed sessions from incomplete/abandoned sessions.
- Prevent cross-user access and use stable pagination.
- Do not imply statistical significance when sample sizes are small.

### 4.7 DSA coding interviews
- Browse problems by topic, difficulty and language support.
- Provide problem statement, constraints, examples, code editor, run/submit states and test summaries.
- Store source code privately and apply limits.
- **Execution must remain disabled** until a separate isolated runner or vetted provider is configured and passes the security gate in document 04.
- If execution is unavailable, show “Code execution is not configured yet”; never fake output or test results.
- Do not expose hidden test cases or runner secrets.

### 4.8 Voice interview
- Optional enhancement; text mode must always work.
- Request browser microphone permission at the point of use and explain what is processed.
- Display the transcript for review/editing before submission.
- Provide mute/stop, retry, permission-denied and unsupported-browser states.
- Do not record/store raw audio by default. If audio storage is ever introduced, require explicit consent, a retention policy and deletion controls.
- Never infer emotion/personality from voice.

### 4.9 PDF interview report
- Generate only from saved, authorized interview data.
- Include role/session metadata, rubric scores, strengths, improvements, question-by-question feedback, skill gaps and next steps.
- Mark incomplete sessions and missing evaluations accurately.
- Use readable typography, accessible contrast, page numbers and generation date.
- Escape untrusted text and check ownership on every generation/download request.
- Reports must not include secrets, internal prompts or hidden evaluation metadata.

### 4.10 Personalized learning roadmap
- Inputs: target role, skill gaps, available minutes per day, target date and optional preferred learning style.
- Output: staged topics, concrete tasks, estimated time, practice outcomes and checkpoints.
- Let users edit tasks, mark progress and pause/resume.
- Regeneration must preserve completed tasks and clearly show what changed.
- Avoid fabricated course links. If external links are supplied, validate them and label third-party resources.

## 5. Main navigation and page inventory

The final route list must be reconciled with existing routes before implementation. Proposed information architecture:
- Public: Home, Features, How It Works, Privacy, Terms, Login, Register, Forgot/Reset Password (if auth supports it).
- Authenticated: Dashboard, Resume Library/Upload, Job Descriptions, Match Results, Interview Setup, Active Interview, Interview Results, Interview History/Details, Analytics, DSA Practice, Learning Roadmap, Profile/Settings.
- Optional: Admin pages only if present/approved.
- Utility: Not Found, Unauthorized/Forbidden, generic error boundary.

Reuse existing route naming where possible; don't duplicate routes or break deep links.

## 6. Non-functional requirements

- Security: server-side validation, ownership checks, least privilege, safe file handling, rate limiting and no secret leakage.
- Reliability: explicit state machines, idempotency where needed, timeouts, bounded retries and transaction safety.
- Performance: pagination, measured indexes, lazy-loaded heavy routes/editor, optimized assets and bounded concurrency.
- Accessibility: keyboard operation, visible focus, labels, contrast, semantic structure, reduced motion and status announcements.
- Privacy: purpose limitation, minimal collection, retention/deletion and transparent AI-provider processing.
- Maintainability: modular services, shared UI components, schema validation, documented env variables and tests.
- Cost: AI token/usage caps, request limits and clear failure handling.

## 7. Release gates

A release is not complete until:
- Baseline and post-change tests/build are compared.
- Migrations have been tested on a disposable/staging database and rollback/recovery is documented.
- Existing login/logout and core routes still work.
- Ownership/security tests pass.
- Mobile and desktop layouts are tested at target widths.
- Loading/empty/error states are verified.
- Environment examples and docs are updated.
- Unavailable integrations are reported as blocked, not simulated as real.
