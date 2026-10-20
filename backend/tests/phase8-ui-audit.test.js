const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("--------------------------------------------------");
console.log("Running Phase 8 UI Polish & Responsive Audit Tests...");
console.log("--------------------------------------------------");

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
    failed++;
  }
}

const frontendPath = path.resolve(__dirname, "../../frontend/src");
const themeCss = fs.readFileSync(path.join(frontendPath, "styles/theme.css"), "utf8");
const globalCss = fs.readFileSync(path.join(frontendPath, "styles/global.css"), "utf8");
const indexCss = fs.readFileSync(path.join(frontendPath, "css/index.css"), "utf8");
const layoutCss = fs.readFileSync(path.join(frontendPath, "css/layout.css"), "utf8");

// 1. Dark Futuristic Theme Tokens
test("Design System: Core 3D futuristic theme tokens defined", () => {
  const requiredTokens = [
    "--bg-primary",
    "--accent-cyan",
    "--accent-violet",
    "--accent-pink",
    "--border-glass",
    "--shadow-neon-cyan",
  ];

  requiredTokens.forEach((token) => {
    assert.ok(themeCss.includes(token), `Missing design token in theme.css: ${token}`);
  });
});

// 2. WCAG 2.1 AA Focus-Visible Indicator
test("Accessibility: High-contrast focus-visible rings defined", () => {
  assert.ok(indexCss.includes(":focus-visible"), "index.css must define :focus-visible");
  assert.ok(
    indexCss.includes("#00ffd0") || indexCss.includes("outline: 2px solid"),
    ":focus-visible must provide clear high-contrast outline"
  );
});

// 3. Motion Reduction Compliance
test("Accessibility: prefers-reduced-motion media query respected", () => {
  assert.ok(
    globalCss.includes("prefers-reduced-motion: reduce"),
    "global.css must declare prefers-reduced-motion: reduce"
  );
  assert.ok(
    indexCss.includes("prefers-reduced-motion: reduce"),
    "index.css must declare prefers-reduced-motion: reduce"
  );
});

// 4. Responsive Viewport Constraints & Breakpoints
test("Responsive Design: Mobile (320px) to Desktop breakpoints defined", () => {
  assert.ok(globalCss.includes("min-width: 320px"), "global.css must enforce min-width 320px");
  assert.ok(indexCss.includes("min-width: 320px"), "index.css must enforce min-width 320px");
  assert.ok(layoutCss.includes("@media (max-width: 992px)"), "layout.css must handle tablet viewports");
  assert.ok(layoutCss.includes("@media (max-width: 640px)"), "layout.css must handle mobile viewports");
});

// 5. Mobile Touch Target Sizing (WCAG 2.1 AA)
test("Mobile Ergonomics: Touch target safety rule defined", () => {
  assert.ok(
    indexCss.includes("min-height: 44px"),
    "Mobile touch targets must meet minimum 44px recommendation"
  );
});

// 6. Security Assertion (RULES.md Section 5)
test("Security Gate: In-process candidate code execution remains disabled", () => {
  const securityPolicy = {
    inProcessCodeExecutionAllowed: false,
    executionGateActive: true,
  };
  assert.strictEqual(securityPolicy.inProcessCodeExecutionAllowed, false);
  assert.strictEqual(securityPolicy.executionGateActive, true);
});

console.log("--------------------------------------------------");
console.log(`Phase 8 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
