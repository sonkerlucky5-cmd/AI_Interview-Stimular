# 06 — UI/UX Design System, Color Palette and Responsive Specification

## 1. Design objective

Make AI_Interview Simulator feel like a polished, trustworthy, modern AI SaaS product for candidates. It should feel calm and focused during interviews, informative on analytics pages, and clear about what AI can and cannot conclude.

**Active Production Theme (Per RULES.md Section 3):**
The active application uses an established **Dark 3D Futuristic Theme** (`#0b0d1a` dark base, cyan `#00ffd0`, violet `#7b61ff`, pink `#ff6ec7`) and smooth scrolling powered by **Lenis + GSAP + Framer Motion**. As strictly governed by `RULES.md` Section 3 (*Existing website protection*), this established visual identity, card design, and motion system must be preserved across all pages.

**Visual direction:** premium, clean, product-led SaaS; deep dark backgrounds for focus, glowing cyan/violet for primary actions and metrics, neutral glass surfaces, restrained gradients.

## 2. Color tokens

Use semantic tokens instead of scattering hex codes throughout components. Define CSS variables in `frontend/src/styles/theme.css` and `frontend/src/css/index.css`.

### Active Dark Theme (Default Production Theme)
| Token | Hex | Usage |
|---|---|---|
| `--bg-primary` / `--color-bg` | `#0B0D1A` | Main application background |
| `--panel` / `--color-surface` | `#0D1226` / `#111C2E` | Cards / glass panels |
| `--panel-border` / `--color-border`| `rgba(255, 255, 255, 0.12)` | Subtle glass borders |
| `--accent-cyan` / `--color-primary` | `#00FFD0` | Tech scores / positive action accents |
| `--accent-violet` | `#7B61FF` | Secondary primary accent / brand glow |
| `--accent-pink` | `#FF6EC7` | Live indicators / highlights |
| `--accent-amber` | `#FFB84D` | Warnings / problem metrics |
| `--text-main` / `--color-text` | `#F2F4FF` | Body & primary headings |
| `--text-muted` | `#94A3B8` | Secondary & meta text |

### Light theme (Optional secondary theme)

| `--color-primary-600` | `#2563EB` | Main primary accent |
| `--color-primary-100` | `#DBEAFE` | Selected surfaces |
| `--color-accent-600` | `#0F766E` | Secondary accent / progress |
| `--color-accent-100` | `#CCFBF1` | Positive accent backgrounds |
| `--color-bg` | `#F8FAFC` | App background |
| `--color-surface` | `#FFFFFF` | Cards / panels |
| `--color-surface-muted` | `#F1F5F9` | Inputs / quiet panels |
| `--color-border` | `#E2E8F0` | Borders / dividers |
| `--color-text` | `#0F172A` | Body text |
| `--color-text-muted` | `#475569` | Secondary text |
| `--color-text-subtle` | `#64748B` | Metadata, only where contrast passes |
| `--color-success` | `#15803D` | Success status |
| `--color-warning` | `#B45309` | Warning status |
| `--color-danger` | `#B91C1C` | Error/destructive status |
| `--color-info` | `#0369A1` | Informational status |
| `--color-focus` | `#2563EB` | Focus ring |

### Dark theme (optional; implement only if the current product supports it or scope permits)
| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#0B1220` | App background |
| `--color-surface` | `#111C2E` | Cards / panels |
| `--color-surface-muted` | `#172338` | Inputs / nested panels |
| `--color-border` | `#29364B` | Borders |
| `--color-text` | `#F1F5F9` | Body text |
| `--color-text-muted` | `#CBD5E1` | Secondary text |
| `--color-primary-600` | `#60A5FA` | Primary action accent |
| `--color-accent-500` | `#2DD4BF` | Secondary accent |
| `--color-success` | `#4ADE80` | Success |
| `--color-warning` | `#FBBF24` | Warning |
| `--color-danger` | `#F87171` | Error |

Rules:
- Do not rely on color alone to communicate status; pair with label/icon.
- Verify WCAG AA contrast for actual text/background combinations, especially muted text and buttons.
- Avoid gradients for body text or large amounts of UI. Use a restrained brand gradient only in hero/marketing decoration if it matches the existing design.
- Keep status colors semantically consistent.

## 3. Typography

Preferred stack: `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. If the project already uses a high-quality licensed/local font, preserve it after checking readability and loading performance.

Type scale:
- Display/hero: `clamp(2.25rem, 4vw, 3.75rem)`, line-height 1.05–1.15, weight 650–750.
- H1 page title: 2rem–2.5rem desktop; 1.75rem–2rem mobile.
- H2 section: 1.375rem–1.75rem.
- H3 card/section: 1.125rem–1.25rem.
- Body: 1rem, line-height 1.5–1.7.
- Small/meta: 0.875rem; do not use below 0.75rem except tiny nonessential labels.
- Code/editor: `ui-monospace, SFMono-Regular, Consolas, monospace`.

Rules: use consistent weights, avoid all-caps long labels, avoid thin low-contrast text, and ensure long job titles/question text wrap correctly.

## 4. Spacing, grid, radii and elevation

Use a 4px base spacing system:
- `--space-1: 4px`
- `--space-2: 8px`
- `--space-3: 12px`
- `--space-4: 16px`
- `--space-5: 20px`
- `--space-6: 24px`
- `--space-8: 32px`
- `--space-10: 40px`
- `--space-12: 48px`
- `--space-16: 64px`

Radii:
- Small controls: 8px.
- Inputs/buttons/cards: 10–14px.
- Large hero/promo panels: 20–24px.
- Use pill shapes only for badges, chips or intentionally rounded toggles.

Layout:
- Main content max width: 1200–1280px, centered.
- Desktop page gutter: 32px; tablet: 24px; mobile: 16px (12px only at very narrow widths if needed).
- Card padding: 20–24px desktop, 16px mobile.
- Use a consistent 8/12/16/24/32px rhythm.
- Shadows subtle and reserved for overlays/popovers or elevated surfaces; prefer borders over heavy shadows.
- Avoid nested cards inside cards unless grouping materially improves clarity.

## 5. Component rules

### Buttons
- Primary: solid primary blue, high-contrast text; one dominant primary action per view.
- Secondary: neutral surface with border.
- Tertiary/ghost: no heavy container until hover/focus.
- Destructive: danger color, confirmation for irreversible actions.
- Include hover, active, focus-visible, disabled and loading states.
- Prevent double-submit; show inline progress.
- Touch target ideally at least 44×44px.

### Forms
- Every input has a visible label; placeholder is not a label.
- Show helper text and field-level errors.
- Keep labels, inputs and errors connected semantically.
- Preserve entered values after recoverable errors.
- Use clear file upload restrictions and progress.
- Confirm before deleting private resumes or learning plans.

### Cards and tables
- Use cards for overview metrics and related content, not every single text block.
- Tables need responsive handling: horizontal scrolling only where appropriate, otherwise convert rows to stacked cards on small screens.
- Use skeletons only for meaningful loading delays; avoid layout shift.

### Navigation
- Desktop: consistent top navigation or sidebar based on existing app shell.
- Mobile: compact header and accessible drawer/bottom navigation if appropriate.
- Clearly show active route and current page title.
- Never hide essential actions behind hover-only controls.
- Keep sign out and profile controls discoverable.

### Feedback and status
- Use toast for brief noncritical confirmation; inline error for errors that need action.
- Use persistent banners for service-wide issues.
- Status badges always include text, not color alone.
- Empty states explain what the user can do next and provide one relevant CTA.

### Charts
- Charts need a visible title, date range, units/metric definitions and accessible text summary.
- Do not present fabricated data. Empty state when no real sessions exist.
- Tooltips must not be the only source of important information.
- Provide a table or text equivalent for key data where feasible.

### AI-generated content
- Label AI-generated feedback clearly.
- Separate “your answer”, “evaluation”, “example answer” and “recommended next step”.
- Use restrained callouts; avoid suggesting the AI result is objectively definitive.
- Show provider failure and retry rather than fake placeholder results.

## 6. Page-by-page UI specification

### Public landing page
- Clear hero: concise value proposition, primary CTA (“Start practising” or existing equivalent), secondary CTA (“See how it works”).
- Show product workflow in 3–4 steps.
- Feature sections for resume matching, mock interviews, feedback, DSA, analytics and roadmap, only if those features exist or are clearly labelled as planned.
- Include honest trust/privacy messaging, FAQ and footer links.
- Avoid fake testimonials, fake user counts, fabricated customer logos or unsupported accuracy claims.

### Authentication
- Simple focused form, readable validation, password visibility toggle if already supported, loading state, forgotten-password flow only if backend supports it.
- Avoid unnecessary decoration that distracts from login.
- Preserve return-to-route behavior where applicable.

### Dashboard
- Greeting and clear “Continue interview”/“Start interview” action depending on real state.
- Overview metrics only from actual data.
- Recent interviews, resume match summary and learning tasks.
- New-user empty state with a clear first step.
- Do not fill empty dashboards with invented scores.

### Resume library and upload
- Drag/drop optional, standard file picker always available.
- Show supported formats and maximum file size before upload.
- Display processing states and parse failures.
- List resumes with date/status/actions; confirm deletion.
- Extracted skills/evidence should be editable/correctable where feasible.

### Job description and match result
- Clear title/company/description form.
- Match results use an understandable summary, matched requirements, gaps, evidence and suggested next steps.
- Avoid implying an ATS guarantee or hiring probability.
- Distinguish “not found in resume” from “candidate does not have this skill”.

### Interview setup
- Group options logically: role/context, interview type, difficulty, language, duration/question count.
- Explain optional resume/JD context and data usage.
- Validate limits before start; show a concise session summary.
- Keep one prominent “Start interview” CTA.

### Active interview room
- Calm, distraction-free layout.
- Main column: question, progress indicator, answer textarea/editor, timer only if the timer has real behavior.
- Secondary area: interview context, hints if supported, voice controls if enabled.
- Clear submit/next/finish actions; prevent accidental duplicate submission.
- Provide autosave/connection state only if implemented and reliable.
- Confirm leaving an in-progress session; allow safe resume where supported.
- Do not show fake “AI is listening” or fake real-time states.

### Evaluation/results
- Summary score with scale definition and category breakdown.
- Strengths, areas to improve, evidence, example answer and suggested practice.
- Explain that AI feedback can be imperfect and is practice guidance.
- Actions: review answer, retry question, return to history, generate report—only when supported.

### Interview history/details
- Search/filter/pagination and status labels.
- Clearly distinguish completed from abandoned/incomplete.
- Empty and no-filter-results states.
- Avoid excessive columns on mobile.

### Analytics
- Trend chart, skills breakdown and recent history with date filters.
- Include sample-size context and definitions.
- Never generate fabricated charts for new accounts.

### DSA workspace
- Problem list with difficulty/topic filters.
- Problem statement/examples/constraints separated from editor and test output.
- Editor must support keyboard navigation and visible focus.
- Clear language selector, run/submit state and execution limits.
- If runner is not configured, disable execution and explain that it is unavailable. Do not simulate test results.

### Voice mode
- Explicit start action and microphone permission explanation.
- Visible mic state, stop/retry, transcript preview/edit and text fallback.
- Permission denial/unsupported browser states must be respectful and actionable.

### PDF report
- Consistent branded cover/header, readable score tables, page numbers, generation date and summary.
- No clipping, broken glyphs or overflow for long answers.
- Mark missing or incomplete data honestly.

### Learning roadmap
- Overview by stage/week, task cards, estimated time, completion checkbox/status and due dates.
- Allow edit/pause/resume.
- Regeneration must preserve completed tasks.
- Mobile layout should make progress controls easy to tap.

### Profile/settings
- Profile and target role; privacy/data controls where implemented; microphone preference if needed.
- Account deletion/export only if fully supported and safe.
- Avoid settings that are cosmetic but nonfunctional.

### Errors and utility pages
- Friendly not-found, unauthorized, offline/API error and maintenance states.
- Provide retry/back-to-dashboard actions where useful.
- Never expose stack traces or raw provider errors.

## 7. Responsive requirements

Test every existing and new route at all these viewport widths:
- Mobile: 320, 360, 375, 390, 414, 430 px.
- Tablet: 600, 768, 820, 900 px.
- Laptop: 1024, 1280, 1366, 1440 px.
- Desktop: 1600, 1920, 2560 px.

Expected behavior:
- No page-level horizontal overflow at any viewport except intentionally scrollable data/code areas.
- Navigation collapses cleanly; controls remain reachable.
- Cards/grid adapt from 1 column mobile → 2 columns tablet → 3/4 only when content width supports it.
- Forms use full width on mobile and constrained width on larger screens.
- Long labels, job titles, questions and errors wrap without overlap.
- Modals fit viewport height and allow internal scrolling.
- Tables have deliberate mobile behavior.
- Charts resize and remain readable.
- Code editor and test output remain usable on small screens.
- Fixed/sticky controls must not cover inputs or browser safe areas.
- Test keyboard-only use and zoom/reflow; don't rely on device emulation alone if a real browser/device check is available.

Suggested breakpoints, only if compatible with current CSS:
- `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.
Use content-driven breakpoints and existing Tailwind/config conventions rather than introducing competing systems.

## 8. Accessibility and motion
- Aim for WCAG 2.2 AA.
- All actions keyboard accessible; visible focus rings.
- Semantic headings and landmarks.
- Labels and accessible names for icon-only controls.
- Status/error updates announced appropriately to assistive technology.
- Contrast tested; never use color alone.
- Support `prefers-reduced-motion`; no essential content depends on animation.
- Animations should be subtle, short and functional; avoid parallax or excessive scroll effects on core workflow.
- Avoid auto-playing audio.

## 9. Motion and interaction
- Button feedback: immediate pressed/loading states.
- Page transitions: optional subtle fade/translate, disabled/reduced when requested.
- Skeletons: stable geometry to avoid layout shift.
- Charts animate only when useful and without obscuring data.
- Avoid excessive GSAP/Framer/animation libraries if CSS or existing tooling is sufficient.
- Do not add dependencies before checking the current package.

## 10. Design implementation guidance
- Inspect current global CSS/theme/tailwind config and reuse them.
- Centralize semantic tokens and component variants.
- Avoid one-off hex colors, duplicate button styles and global selectors that leak into unrelated pages.
- Refactor incrementally and preserve current content and route behavior.
- Build shared components only where repeated patterns justify them.
- Use real product screenshots/assets or neutral illustrations; do not invent logos/brand endorsements.
- Optimize images, font loading and route chunks.
- Check light/dark theme consistency if both themes exist.
- Create a route-by-route visual QA checklist and record pass/fail by viewport.
