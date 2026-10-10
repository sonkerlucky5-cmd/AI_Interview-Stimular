# AI_Interview-Stimular — Documentation Pack

Read this file first. This pack is the implementation blueprint for completing the existing website end-to-end.

## Files in this pack

1. `01_PRD_and_Product_Requirements.md` — product scope, user journeys, acceptance criteria.
2. `02_Architecture_and_Data_Flows.md` — application architecture and feature flows.
3. `03_PostgreSQL_Schema_and_Migrations.md` — proposed schema and safe migration guidance.
4. `04_API_Contracts_Security_and_Privacy.md` — API conventions, authorization, privacy and security.
5. `05_Implementation_Testing_Deployment_Runbook.md` — phases, QA, deployment and definition of done.
6. `06_UI_UX_Design_System_and_Responsive_Spec.md` — colors, typography, spacing, layouts, components, pages, responsive and accessibility rules.
7. `07_Antigravity_Master_Prompt_and_Acceptance_Checklist.md` — exact instructions for Antigravity and end-to-end completion gates.

## Critical operating rule

These documents describe the desired target state. They do not prove that any feature is implemented. Antigravity must inspect the real repository first, compare it to these documents, and report the gaps before editing.

## Design rule

The palette and UI system in document 06 are the proposed target design system. First inspect the current website. Preserve its working brand identity and layout where it already meets these standards; otherwise migrate gradually and consistently. Do not redesign unrelated screens just for novelty. Do not invent current product features that are not implemented.

## Safe implementation rule

- Do not drop/reset tables, wipe user data, or run destructive migrations.
- Never commit `.env`, credentials, tokens, private uploads, or production data.
- Do not run candidate-submitted code in the Express process.
- Keep coding execution disabled until a separate sandboxed runner has passed security checks.
- Never claim a feature is complete unless its real implementation and tests support that claim.
- Ask for approval before destructive/irreversible actions, paid services, production deployment, or major design changes.
