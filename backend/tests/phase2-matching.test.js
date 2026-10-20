const assert = require("assert");
const { extractSkillsAndEntities } = require("../services/resumeService");
const { calculateResumeMatch } = require("../services/matchingService");
const ApiError = require("../utils/ApiError");

console.log("--------------------------------------------------");
console.log("Running Phase 2 Resume & Job Matching Tests...");
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

// 1. ApiError code test
test("ApiError supports custom machine-readable codes", () => {
  const err = new ApiError(404, "Resume not found.", "RESUME_NOT_FOUND");
  assert.strictEqual(err.statusCode, 404);
  assert.strictEqual(err.message, "Resume not found.");
  assert.strictEqual(err.code, "RESUME_NOT_FOUND");
  assert.strictEqual(err.isOperational, true);
});

// 2. Skill Extraction from Resume text
test("extractSkillsAndEntities extracts known skills and contact info", () => {
  const resumeText = `
    Jane Doe
    Email: jane.doe@example.com | Phone: (555) 123-4567
    Full Stack Developer with 4 years of experience.
    Proficient in React, Node.js, Express, PostgreSQL, and Docker.
    Passionate about Data Structures, Algorithms, and System Design.
  `;

  const extracted = extractSkillsAndEntities(resumeText);
  assert.ok(Array.isArray(extracted.skills), "Skills should be an array");
  assert.ok(extracted.skills.includes("React"), "Should detect React");
  assert.ok(extracted.skills.includes("Node.js"), "Should detect Node.js");
  assert.ok(extracted.skills.includes("PostgreSQL"), "Should detect PostgreSQL");
  assert.ok(extracted.skills.includes("Docker"), "Should detect Docker");
  assert.ok(extracted.contactCues.hasEmail, "Should detect email presence");
  assert.ok(extracted.contactCues.hasPhone, "Should detect phone presence");
  assert.ok(extracted.metrics.wordCount > 10, "Should compute word count");
});

// 3. calculateResumeMatch with high match
test("calculateResumeMatch calculates accurate score, matched skills & evidence", () => {
  const resumeText = "Experienced engineer skilled in React, TypeScript, and Node.js. Built high scale web applications.";
  const resumeSkills = ["React", "TypeScript", "Node.js"];
  const job = {
    title: "Senior Full Stack Engineer",
    description: "Looking for a developer with strong React and Node.js skills.",
    requirements: ["React", "Node.js", "AWS"],
  };

  const match = calculateResumeMatch(resumeText, resumeSkills, job);
  assert.ok(typeof match.score === "number", "Score must be numeric");
  assert.ok(match.score >= 0 && match.score <= 100, "Score must be within [0, 100]");
  assert.ok(match.matchedSkills.includes("React"), "React should be matched");
  assert.ok(match.matchedSkills.includes("Node.js"), "Node.js should be matched");
  assert.ok(match.missingSkills.includes("AWS"), "AWS should be marked missing");
  assert.ok(match.evidence.length > 0, "Evidence snippets should be generated");
  assert.ok(match.disclaimer.includes("algorithmic keyword heuristic"), "Disclaimer must be included");
});

// 4. calculateResumeMatch handles zero requirements gracefully
test("calculateResumeMatch handles empty job requirements without crashing", () => {
  const resumeText = "Software engineer proficient in Python and Django.";
  const resumeSkills = ["Python", "Django"];
  const job = {
    title: "General Software Developer",
    description: "General role without specific keywords.",
    requirements: [],
  };

  const match = calculateResumeMatch(resumeText, resumeSkills, job);
  assert.ok(typeof match.score === "number", "Score should still be calculated");
  assert.ok(match.score >= 0 && match.score <= 100, "Score must be within [0, 100]");
  assert.ok(Array.isArray(match.suggestions), "Suggestions array must exist");
});

console.log("--------------------------------------------------");
console.log(`Phase 2 Tests Finished: ${passed} passed, ${failed} failed`);
console.log("--------------------------------------------------");

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
