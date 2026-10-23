# AI Interview Simulator --- SEO, AEO, GEO, AIO, SXO & Growth Optimization Rules

> **Purpose:** Add these rules to the project's `RULES.md` (or the
> relevant AI-agent rules file) so an AI coding assistant can audit and
> improve the AI Interview Simulator responsibly.
>
> **Operating principle:** Audit first, explain findings, propose a
> plan, then implement only within the approved scope. Do not rebuild
> the application or make unrelated changes.

------------------------------------------------------------------------

## 1. Mandatory Working Rules

1.  **Inspect before changing.** Read the existing project instructions,
    `README`, package manifests, framework configuration, route
    definitions, page components, API routes, metadata, sitemap, robots
    file, and existing tests before recommending changes.
2.  **Preserve the current stack and architecture.** Do not replace
    frameworks, routing systems, database technology, authentication, UI
    libraries, or deployment configuration just to implement
    optimization.
3.  **No unapproved scope changes.** Do not redesign pages, change
    branding, alter product functionality, remove features, modify
    database schemas, or change authentication flows unless explicitly
    approved.
4.  **No destructive actions.** Do not delete files, overwrite user
    work, run destructive database commands, rotate secrets, or make
    broad refactors without explicit approval.
5.  **No Git operations without approval.** Do not commit, push, merge,
    create releases, or change remote repository settings unless the
    user explicitly asks.
6.  **Protect secrets and personal data.** Never expose API keys,
    database URLs, JWT secrets, SMTP credentials, access tokens, private
    interview responses, resumes, or user data in logs, source code,
    public pages, metadata, or reports.
7.  **Verify every change.** Run relevant linting, tests, type checks,
    and production builds when available. Report commands run and actual
    outcomes. Never claim a check passed if it was not run.
8.  **Avoid SEO guarantees.** Do not promise Google rankings, rich
    results, AI citations, or traffic growth. Explain that search and AI
    visibility depend on many external factors.
9.  **Use evidence.** Distinguish verified code findings from
    assumptions and recommendations. Do not invent existing routes,
    features, analytics data, or search performance.
10. **Report before implementation when scope is unclear.** If a change
    could affect routing, indexing, authentication, user data,
    application behavior, or visual design, explain the risk and ask for
    approval first.

## 2. Start With a Project Audit

Identify and document the actual implementation:

-   Framework, framework version, rendering mode, build tool, and
    deployment platform.
-   Public pages, authenticated pages, admin pages, dynamic routes, and
    API routes.
-   Whether each public page is server-rendered, statically generated,
    client-rendered, or otherwise rendered.
-   Existing title and description metadata, canonical tags, Open Graph
    tags, and social card metadata.
-   `robots.txt`, XML sitemap, canonical URL rules, redirects, 404
    handling, and indexability controls.
-   Existing structured data / Schema.org markup and whether it matches
    visible page content.
-   Heading hierarchy, page content, internal links, breadcrumbs, image
    alternatives, and accessible labels.
-   Page performance, JavaScript and CSS loading, font loading, mobile
    behavior, and layout stability.
-   Forms, registration, login, subscription/pricing flow, and the
    primary conversion actions.
-   Existing analytics, Search Console integration, privacy/consent
    behavior, and available measurement data.
-   Existing tests and project-specific rules.

For each finding, record: **status (verified / not verified), evidence
or file path, impact, recommended action, risk, and test method.**

## 3. SEO --- Search Engine Optimization

Goal: Help search engines discover, crawl, understand, and appropriately
index useful public pages.

### Audit and implementation checklist

-   Give every indexable public page a unique, descriptive title and
    meta description.
-   Use one clear primary page heading and a logical heading hierarchy.
-   Make page content useful, accurate, original, and aligned with the
    page's search intent.
-   Use descriptive, stable URLs and consistent internal links.
-   Add canonical URLs only when the correct canonical destination is
    known.
-   Generate an XML sitemap containing only canonical, indexable,
    intended-public URLs that return successful responses.
-   Keep `robots.txt` syntax valid. Do not confuse crawling restrictions
    with noindex directives.
-   Do not accidentally block important CSS or JavaScript resources
    required to render pages.
-   Use redirects for genuine URL changes and avoid redirect chains or
    loops.
-   Provide useful 404 behavior and ensure nonexistent pages do not
    return misleading success responses.
-   Handle trailing slashes, casing, query parameters, pagination, and
    duplicate URL variants consistently.
-   Add image alt text that describes meaningful images; use empty alt
    text for purely decorative images.
-   Add relevant internal links between related public pages.
-   Use structured data only when the content qualifies and the markup
    accurately represents visible content.
-   Check mobile usability, HTTPS, loading performance, and basic
    accessibility.
-   Do not expose private routes, interview reports, account pages,
    admin pages, or personal user content through the sitemap or public
    metadata.

### AI Interview Simulator public-page ideas

Audit whether the product genuinely has or needs public pages such as:

-   Home / product overview
-   Features
-   How it works
-   Interview types (behavioral, technical, DSA, or voice only if
    actually supported)
-   Pricing (only if pricing exists)
-   Documentation / help
-   Blog or learning resources (only if maintained)
-   Privacy policy and terms

Do not create pages just to target keywords. Do not describe features as
available until they are implemented and verified.

## 4. AEO --- Answer Engine Optimization

Goal: Make useful information easy for answer-oriented search
experiences to interpret and potentially use.

-   Answer real user questions clearly and directly near the relevant
    heading.
-   Use descriptive headings, concise definitions, step-by-step
    explanations, and FAQs where they genuinely help users.
-   Explain how the AI Interview Simulator works, what it evaluates, who
    it is for, and what its limitations are.
-   Use consistent terminology for supported features and evaluation
    criteria.
-   Provide examples only when they are accurate and do not expose real
    users' private interview content.
-   Keep answers factual, readable, and supported by credible references
    where appropriate.
-   Do not add FAQ content solely to manipulate search features.
-   Do not assume FAQ structured data will create a special search
    result.
-   Do not claim that AEO guarantees inclusion in a direct answer.

## 5. GEO --- Generative Engine Optimization

Goal: Improve the clarity, credibility, discoverability, and
citation-worthiness of public information that generative AI systems may
encounter.

-   Publish helpful, original, clearly attributed content that
    demonstrates the product's real capabilities.
-   Make the organization/product identity, purpose, supported features,
    and contact or policy information consistent across public pages.
-   Use descriptive page titles, meaningful headings, clear facts, and
    crawlable public content.
-   Cite reliable primary sources for factual claims, statistics, and
    research-based statements.
-   Add author, reviewer, or publication information when it is genuine
    and useful.
-   Keep product descriptions consistent across the website and official
    profiles.
-   Fix broken links, outdated claims, and contradictory information.
-   Review publicly available AI crawler guidance and platform policies
    before changing crawler access.
-   Do not automatically allow or block every AI crawler. Assess the
    business, privacy, legal, licensing, and content implications first.
-   Never publish private interview questions, candidate answers,
    resumes, customer data, or internal documentation merely to gain AI
    visibility.
-   Do not promise that ChatGPT, Gemini, or another AI system will cite
    or recommend the product.

## 6. AIO --- AI Optimization (Broad, Context-Dependent Term)

AIO is not one universally standardized technical discipline. In this
rules file, use it as an umbrella for responsible optimization of
content and technical structure for AI-assisted discovery and
understanding.

-   Keep product facts, feature descriptions, documentation, and
    terminology consistent.
-   Use semantic HTML and accessible labels so both people and software
    can interpret page structure.
-   Provide structured, machine-readable information only where
    appropriate and accurate.
-   Make important public information available in stable, crawlable
    pages when that aligns with product policy.
-   Clearly label AI-generated interview feedback and explain its
    limitations.
-   Avoid unsupported claims such as "100% accurate AI evaluation,"
    "guaranteed job," or "perfect score prediction."
-   Do not add hidden keyword text, fake reviews, fabricated authors, or
    misleading structured data.
-   Separate AI product functionality from search/marketing
    optimization; do not modify the interview model or evaluation logic
    under an SEO task without explicit approval.

## 7. SXO --- Search Experience Optimization

Goal: Ensure that the visitor's experience from search result to
relevant page is coherent, useful, accessible, and trustworthy.

-   Match page titles and descriptions to the actual page content.
-   Make the page's purpose clear quickly, especially on mobile.
-   Ensure primary calls to action are understandable and functional.
-   Avoid intrusive popups, deceptive patterns, misleading urgency, and
    confusing navigation.
-   Keep important information accessible without unnecessary steps.
-   Ensure public landing pages load and render correctly on supported
    screen sizes.
-   Test the path from a public landing page to registration, login, and
    the first interview.
-   Do not force visitors into registration before explaining the
    product's value, unless that is a deliberate approved product
    decision.
-   Check empty states, validation messages, errors, loading indicators,
    and keyboard navigation.
-   Measure meaningful outcomes, not just clicks: successful sign-ups,
    interview starts, completed interviews, and user-reported
    usefulness.

## 8. ASO --- App Store Optimization

Apply this section only if the project has a real mobile application
listed or intended for release in an app store.

-   Optimize the app title, short description, long description,
    categories, screenshots, and preview assets for accuracy and
    clarity.
-   Use only features that exist in the app.
-   Follow current Google Play and Apple App Store metadata, privacy,
    and review policies.
-   Do not claim ASO work is completed for a web-only application.
-   Do not use fake ratings, incentivized misleading reviews, keyword
    stuffing, or competitor trademarks deceptively.

## 9. CRO --- Conversion Rate Optimization

Goal: Improve the rate at which relevant visitors complete intended
actions without misleading or pressuring them.

Potential conversions, if supported by the product:

-   Create an account
-   Complete onboarding
-   Start a mock interview
-   Complete an interview
-   View or download a report
-   Start a subscription or purchase

Rules:

-   Define the conversion event and baseline before making changes.
-   Identify friction using available evidence; do not invent conversion
    problems.
-   Keep forms focused and error messages helpful.
-   Make pricing, limitations, and required steps transparent.
-   Do not weaken security or privacy to reduce friction.
-   Do not run experiments without a suitable measurement plan and
    approval where required.
-   Avoid declaring a winner from tiny samples or insufficient data.
-   Preserve accessibility and honest consent.

## 10. UXO --- User Experience Optimization

-   Follow the project's established design system and component
    conventions.
-   Preserve existing branding and layout unless a design change is
    approved.
-   Test keyboard navigation, visible focus, semantic controls, labels,
    contrast, and readable text.
-   Check mobile and desktop layouts across the project's established
    breakpoints.
-   Ensure loading, empty, success, and error states are understandable.
-   Keep navigation and actions consistent.
-   Do not remove working functionality merely to simplify the
    interface.
-   For authenticated pages, verify that errors and loading states do
    not leak private data.

## 11. WPO --- Web Performance Optimization

Goal: Improve real loading and interaction performance without breaking
the application.

Audit, where tools and project support permit:

-   Initial JavaScript and CSS payloads.
-   Unused code, large dependencies, and safe code-splitting
    opportunities.
-   Image formats, dimensions, compression, lazy loading, and layout
    space reservation.
-   Font loading, third-party scripts, caching, compression, and network
    requests.
-   Server response time and slow API calls.
-   Core Web Vitals: LCP, INP, and CLS, using real measurements when
    available.
-   Build output and regressions before/after a change.

Rules:

-   Measure first; do not claim performance improved without comparable
    measurements.
-   Avoid removing dependencies or changing architecture without a
    demonstrated reason.
-   Do not lazy-load critical above-the-fold content in a way that harms
    usability.
-   Preserve accessibility and visual correctness.
-   Never publish fabricated Lighthouse or Core Web Vitals scores.

## 12. VSO --- Voice Search Optimization

Apply where conversational or voice queries are relevant.

-   Use natural language for real questions users ask.
-   Provide concise, direct answers supported by the page's content.
-   Keep local business details accurate if the product has a genuine
    local presence.
-   Ensure mobile usability and page performance.
-   Do not create awkward keyword-stuffed content or promise
    voice-search placement.

## 13. LSO --- Local Search Optimization

Apply only if the business genuinely serves a geographic area or has an
eligible real-world location.

-   Maintain accurate official business name, address, phone, hours, and
    service areas where applicable.
-   Keep official listings consistent and up to date.
-   Use local landing pages only when they provide real, distinct value.
-   Do not fabricate offices, locations, testimonials, or service areas.
-   Do not add local business schema to a remote-only SaaS product
    without a legitimate basis.

## 14. ORM --- Online Reputation Management

-   Monitor genuine reviews, support feedback, and public product
    mentions where tools and permissions allow.
-   Respond professionally and accurately.
-   Escalate security, privacy, billing, or safety complaints through
    the proper process.
-   Never fabricate reviews, suppress legitimate criticism deceptively,
    or disclose a user's private information.
-   Do not claim monitoring is active unless a real source and process
    are configured.

## 15. SMM --- Social Media Marketing

-   Keep official product descriptions and links consistent across
    social profiles.
-   Share useful, accurate product updates and educational content.
-   Do not claim features, customer counts, results, or endorsements
    without evidence.
-   Do not publish private interview data, confidential roadmap
    information, or user content without authorization.
-   Track campaign results only when analytics are available and
    configured.

## 16. SEM and PPC --- Paid Search Marketing

Apply only when paid advertising is explicitly in scope.

-   Define campaign goal, audience, budget, landing page, and success
    metrics before launch.
-   Keep ad copy consistent with the landing page and actual product
    capabilities.
-   Do not start, pause, or change campaigns, budgets, bids, or billing
    settings without explicit approval.
-   Do not use misleading claims or competitor trademarks deceptively.
-   Track conversions responsibly and respect consent and applicable
    privacy requirements.
-   Do not state that campaigns are running unless account evidence
    confirms it.

## 17. CXM --- Customer Experience Management

-   Review the complete user journey: discovery, registration,
    onboarding, interview setup, interview completion, report review,
    and support.
-   Use feedback and product analytics only when available and
    authorized.
-   Make support, privacy, billing, and account deletion paths
    understandable.
-   Improve error recovery and communicate limitations honestly.
-   Do not access or expose individual user records without
    authorization.

## 18. CIM --- Content / Information Management

The acronym CIM can mean different things in different contexts. In this
project, use it only to mean organizing and maintaining public product
content and documentation.

-   Maintain a clear source of truth for product features, policies,
    help articles, and public FAQs.
-   Record content owner, last-reviewed date, and links to supporting
    sources where appropriate.
-   Remove or update outdated claims after confirming the correct
    replacement.
-   Avoid duplicate or contradictory public pages.
-   Do not delete, rewrite, or publish large content sets without review
    and approval.

## 19. E-E-A-T --- Content Credibility Principles

E-E-A-T stands for Experience, Expertise, Authoritativeness, and
Trustworthiness. Treat it as a content-quality framework, not a direct
ranking score or guaranteed ranking factor.

-   Show genuine authorship and qualifications when relevant and
    verifiable.
-   Cite reliable sources for factual, technical, or research-based
    claims.
-   Explain how the product works and what it can and cannot do.
-   Keep privacy policy, terms, contact/support information, and company
    details accurate.
-   Avoid fake testimonials, invented case studies, fabricated
    credentials, and unsupported success statistics.
-   For career advice or interview guidance, be clear about limitations
    and avoid guaranteeing employment outcomes.

## 20. AI Interview Simulator --- Product-Specific Safety and Privacy

-   Never index private dashboards, interview sessions, personal
    reports, resumes, account settings, or admin pages.
-   Require proper authentication and authorization on private pages and
    APIs; `robots.txt` is not an access-control mechanism.
-   Use `noindex` only as an indexing control, not as a substitute for
    authentication.
-   Keep user-specific content out of public sitemaps, metadata, logs,
    analytics payloads, and error messages.
-   Do not include sensitive user content in Open Graph previews or page
    titles.
-   Do not expose internal API endpoints or secrets through public HTML,
    source maps, metadata, or client bundles.
-   Ensure public sample reports use synthetic or explicitly authorized
    data.
-   Keep privacy, consent, retention, export, and deletion behavior
    aligned with the actual implementation and applicable obligations.
-   Do not change authentication, authorization, database access, AI
    evaluation, or report generation logic under an optimization-only
    task without explicit approval.

## 21. Measurement and Reporting

Use only data sources that are actually configured and authorized, such
as Search Console, web analytics, performance reports, server logs, or
app-store analytics.

Report relevant metrics where available:

-   Search impressions, clicks, CTR, and average position.
-   Indexed and excluded URL counts.
-   Organic landing-page sessions and relevant search queries.
-   Valid structured-data errors, if applicable.
-   LCP, INP, CLS, and other measured performance indicators.
-   Sign-up conversion, interview-start rate, completion rate, and
    report-view rate.
-   Referral traffic from AI platforms only where the analytics source
    can reliably identify it.
-   App-store impressions and installs only for a real app with
    available analytics.
-   Paid campaign spend and conversions only when authorized advertising
    data is available.

For each metric, state the date range, source, and known limitations. Do
not fabricate baseline values or attribute causation from correlation
alone.

## 22. Required Workflow for Every Optimization Task

### Phase 1 --- Discover

-   Read project instructions and identify the relevant code.
-   Map routes and classify pages as public, private, admin, or API.
-   Identify existing SEO, content, performance, analytics, and
    conversion implementation.

### Phase 2 --- Audit

-   Produce a findings list with file paths and evidence.
-   Classify each finding as critical, high, medium, low, or
    informational.
-   Separate confirmed defects from opportunities and assumptions.
-   Note privacy, security, compatibility, and deployment risks.

### Phase 3 --- Plan

-   Recommend the smallest safe set of changes.
-   List files expected to change and why.
-   Describe acceptance criteria and tests.
-   Wait for approval before high-impact, destructive, architectural,
    design, or out-of-scope changes.

### Phase 4 --- Implement

-   Follow the existing code style and architecture.
-   Make focused, minimal changes.
-   Avoid unrelated refactoring and dependency changes.
-   Keep metadata, structured data, sitemap URLs, and page content
    consistent.

### Phase 5 --- Verify

-   Run the relevant lint, type check, unit/integration tests, and
    production build if available.
-   Test changed routes, canonical URLs, metadata, sitemap output,
    robots behavior, and redirects.
-   Confirm private content is not exposed or indexable.
-   Test responsive layouts and accessibility for UI changes.
-   Report tests that could not be run and why.

### Phase 6 --- Report

Provide: 1. Summary of the audit. 2. Confirmed issues and evidence. 3.
Files changed. 4. What was changed and why. 5. Commands/tests run and
their real results. 6. Remaining risks, limitations, and manual steps.
7. Recommended next phase.

Do not report work as complete if verification failed or critical checks
remain untested.

## 23. Definition of Done

An optimization task is complete only when:

-   The change matches the approved scope.
-   Existing functionality and design are preserved unless changes were
    approved.
-   Public/private route boundaries remain correct.
-   No private data or secrets are exposed.
-   Metadata, canonical URLs, sitemap, robots directives, and structured
    data are consistent where relevant.
-   Applicable tests and builds have been run, with failures documented.
-   Accessibility and responsive behavior have been considered for UI
    changes.
-   Claims are evidence-based and no ranking, citation, or conversion
    guarantee is made.
-   The final report clearly distinguishes completed work from
    recommendations.

------------------------------------------------------------------------

## 24. Instruction to the AI Coding Agent

Before modifying this project, confirm the actual framework and current
implementation from the repository. Then audit the applicable sections
above and report findings. **Do not blindly apply every category**: ASO,
LSO, SEM/PPC, SMM, and other sections are conditional and should be used
only when relevant to the actual product and approved scope.

Prioritize safe, measurable improvements for the AI Interview Simulator.
Preserve existing application behavior, UI, data, security, and
architecture. Ask before making significant changes. Never push code to
GitHub unless explicitly instructed.
