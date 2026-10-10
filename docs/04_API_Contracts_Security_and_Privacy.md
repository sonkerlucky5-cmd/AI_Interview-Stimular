# 04 — API Contracts, Security and Privacy

## 1. API conventions
- Preserve existing route prefixes, auth middleware and response patterns when reasonable.
- Validate all request bodies, params, query values, enums, lengths, file sizes and pagination.
- Use consistent errors, for example `{ "error": { "code": "VALIDATION_ERROR", "message": "Please check the submitted fields.", "requestId": "..." } }`; do not leak stack traces in production.
- Use request IDs for tracing.
- Use parameterized SQL.
- Never accept client-supplied `user_id` as proof of ownership.
- Every resource read/update/delete/download must check ownership server-side.
- Make retryable write operations idempotent where duplicate requests could create duplicate answers/reports/charges.

## 2. Proposed endpoint inventory

These are proposals, not instructions to duplicate existing routes. Audit and adapt existing endpoints first.

### Resume and job descriptions
- `POST /api/resumes`
- `GET /api/resumes`
- `GET /api/resumes/:id`
- `DELETE /api/resumes/:id`
- `POST /api/job-descriptions`
- `GET /api/job-descriptions`
- `GET /api/job-descriptions/:id`
- `PATCH /api/job-descriptions/:id`
- `DELETE /api/job-descriptions/:id`
- `POST /api/resume-matches`
- `GET /api/resume-matches/:id`

### Interview and evaluation
- `POST /api/interviews`
- `GET /api/interviews`
- `GET /api/interviews/:id`
- `POST /api/interviews/:id/start`
- `POST /api/interviews/:id/answers`
- `POST /api/interviews/:id/next-question`
- `POST /api/interviews/:id/complete`
- `POST /api/interviews/:id/abandon`
- `POST /api/answers/:id/evaluate`
- `GET /api/answers/:id/evaluation`
- `GET /api/interviews/:id/evaluations`

### Analytics and DSA
- `GET /api/analytics/overview`
- `GET /api/analytics/progress?period=30d`
- `GET /api/analytics/skills`
- `GET /api/coding/questions`
- `GET /api/coding/questions/:id`
- `POST /api/coding/submissions`
- `GET /api/coding/submissions/:id`
- `GET /api/coding/interviews/:id/history`

### Voice, reports and plans
- `POST /api/voice/transcriptions` (only if server-side transcription is chosen)
- `GET /api/voice/transcriptions/:id`
- `POST /api/interviews/:id/report`
- `GET /api/interviews/:id/report`
- `GET /api/reports/:id/download`
- `POST /api/learning-plans`
- `GET /api/learning-plans`
- `GET /api/learning-plans/:id`
- `PATCH /api/learning-plans/:id/items/:itemId`
- `POST /api/learning-plans/:id/regenerate`

## 3. Authentication and authorization
- Reuse current auth; do not silently replace JWT/cookie/session implementation.
- Verify signature, expiry, issuer/audience where applicable, and expected claims.
- Production cookies should be `HttpOnly`, `Secure`, appropriate `SameSite`, path and expiry; test actual cross-origin deployment.
- Evaluate CSRF protection for cookie-authenticated state-changing requests.
- Use explicit CORS allowlist; do not use wildcard origins with credentials.
- Apply ownership checks on every user-owned resource.
- Use least-privilege database credentials and rotate exposed secrets.
- Avoid revealing whether another user's private resource exists; return consistent authorization behavior.

## 4. File and prompt safety
- Allowlist supported formats; verify magic bytes/signature and parseability, not extension alone.
- Limit file size, page count and extracted text length.
- Use generated storage keys and private storage.
- Treat resume/job-description text as untrusted content. It may contain prompt-injection attempts; it must never override system/developer instructions or trigger tools/actions.
- Do not log raw resumes or transcripts by default.
- Clean up temporary files on both success and failure.

## 5. AI integration
- Keep provider API keys server-side only.
- Centralize provider selection, timeouts, bounded retries, token/output limits, schema validation and usage tracking.
- Validate structured AI output against a strict schema before saving/rendering.
- Escape/format user-generated content safely.
- Never let AI output choose arbitrary SQL, filesystem paths, URLs to fetch, shell commands or permissions.
- Handle provider timeout, rate limit, malformed output, unavailable key and quota exhaustion distinctly.
- Keep mock responses clearly marked as test mocks; never present them as real AI results.
- Use rubric/model versioning for repeatable evaluation.

## 6. DSA execution security gate
Candidate code must never execute in Express or with application credentials. Enable execution only after:
- Separate sandbox/service or vetted provider is selected and configured.
- CPU, wall-clock, memory, process, file size and output limits are enforced.
- Network access is disabled by default.
- Filesystem is ephemeral and restricted.
- No secrets, production database credentials, cloud metadata or privileged mounts are accessible.
- Each submission is isolated and cleanup is verified.
- Abuse/rate limits and monitoring exist.
- Security tests cover infinite loops, excessive output, memory pressure, filesystem traversal and network attempts.
Until then, code execution UI must be disabled or explicitly labelled unavailable.

## 7. Voice and privacy
- Request microphone permission only when the user starts voice mode.
- Clearly explain whether audio is processed locally or sent to a provider.
- Offer transcript review and text fallback.
- Do not retain raw audio by default.
- If audio storage is introduced, obtain explicit consent and define retention/deletion.
- Do not infer emotion, personality, intelligence or competence from voice or face.
- Disclose third-party AI/speech processing and relevant retention in the privacy notice.

## 8. Rate limits and abuse prevention
Use configurable per-user/IP limits for auth, uploads, parsing, matching, interview generation, evaluation, voice, reports and coding submissions. Add quotas, bounded concurrency and maximum question counts. Do not make the frontend the only enforcement layer.

## 9. Security test checklist
- Missing/expired/invalid auth.
- User A attempts to read/update/delete User B's resources.
- Malformed payload, invalid ID, oversized input and unsupported enum.
- Duplicate answer submission and concurrent next-question requests.
- Invalid/oversized/malformed resume upload.
- AI timeout, rate limit and invalid JSON.
- Unauthorized report download.
- Microphone permission denied and speech provider failure.
- Runner timeout/resource/network/filesystem attempts.
- CORS/cookie/CSRF behavior in actual deployment.
- Secret scanning and checks that production errors/logs don't expose private data.
