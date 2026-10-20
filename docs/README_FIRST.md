# AI_Interview Simulator — Documentation Pack

Read this file first. This pack is the implementation blueprint for completing the existing website end-to-end as a full SaaS product.

## Files in this pack

0. `RULES.md` — **MANDATORY RULES:** Read-only by default, strict no-push rule, explicit approvals, and safety guardrails. Overrides all other prompts.
1. `01_PRD_and_Product_Requirements.md` — product scope, user journeys, acceptance criteria.
2. `02_Architecture_and_Data_Flows.md` — application architecture and feature flows.
3. `03_PostgreSQL_Schema_and_Migrations.md` — proposed schema and safe migration guidance.
4. `04_API_Contracts_Security_and_Privacy.md` — API conventions, authorization, privacy and security.
5. `05_Implementation_Testing_Deployment_Runbook.md` — phases, QA, deployment and definition of done.
6. `06_UI_UX_Design_System_and_Responsive_Spec.md` — colors, typography, spacing, layouts, components, pages, responsive and accessibility rules.
7. `07_Antigravity_Master_Prompt_and_Acceptance_Checklist.md` — exact instructions for Antigravity and end-to-end completion gates.
8. `08_SaaS_Pricing_Tiers_and_Quota_Limits.md` — commercial tiers (Free/Pro/Team), quotas, billing flows, and usage limits.
9. `PROJECT-STATUS.md` — live feature-by-feature implementation status tracker (Phases 0–9).
10. `10-CHANGE-LOG.md` — versioned audit trail of approved modifications.

## Critical operating rule

These documents describe the desired target state. They do not prove that any feature is implemented. Antigravity must inspect the real repository first, compare it to these documents, and report the gaps before editing.

## Design rule

The palette and UI system must preserve the website's established dark futuristic brand identity (`#0b0d1a`, cyan `#00ffd0`, violet `#7b61ff`, pink `#ff6ec7`) and existing smooth scroll stack (Lenis + GSAP/Framer Motion) as mandated by `RULES.md` Section 3. Do not redesign unrelated screens just for novelty. Do not invent current product features that are not implemented.

## Safe implementation rule

- Always follow `RULES.md` before inspecting or editing anything.
- Do not drop/reset tables, wipe user data, or run destructive migrations.
- Never commit `.env`, credentials, tokens, private uploads, or production data.
- Never push code or any changes to GitHub or any Git remote (`GitHub push: NOT PERFORMED`).
- Do not run candidate-submitted code in the Express process.
- Keep coding execution disabled until a separate sandboxed runner has passed security checks.
- Never claim a feature is complete unless its real implementation and tests support that claim.
- Ask for explicit approval before any changes, destructive/irreversible actions, paid services, production deployment, or major design changes.

