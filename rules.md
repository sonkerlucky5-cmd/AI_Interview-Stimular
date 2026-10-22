# RULES.md — Mandatory AI Coding-Agent Rules

> **Important:** This file is mirrored from [docs/RULES.md](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/docs/RULES.md). Always consult this document before inspecting or modifying code.

## PROJECT RULES

**Ponytail mode on.** Minimal code likho, lekin ye kabhi skip mat karna:
- Auth/ownership checks
- Server-side input validation
- Output escaping
- Parameterized queries
- Error handling
- Tests
*(Minimal code ka matlab kam checks nahi.)*

### Process:
- Pehle audit/plan do, mere approval ke baad hi code.
- Jo feature real nahi hai usme fake/hardcoded data mat bharo. Mujhse poochho.
- Sirf wahi files badlo jo scope mein hain.

### Safety:
- Koi git commit ya push mat karna.
- Secrets, cookies, tokens, passwords kabhi print/log mat karna.
- `.env` ko mat chhuo. Migration ya DB change bina approval ke nahi.
- DSA code execution flags (`DSA_EXECUTION_ENABLED`, `DSA_SECURITY_REVIEW_APPROVED`) mat badalna.

### Verification:
- Har kaam ke baad `npm run build` / tests ka poora output dikhao (warnings ke saath) aur `git status --short`.
- Jo verify nahi kiya, wo clearly "not verified" likho.

---

For the full detailed specification, see [docs/RULES.md](file:///c:/Users/HP/OneDrive/Desktop/AI_Interview%20Simulator/docs/RULES.md).
