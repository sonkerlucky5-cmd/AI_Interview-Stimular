/**
 * Resume-to-Job Matching Engine (Heuristic-based)
 */

const { extractSkillsAndEntities } = require("./resumeService");

const calculateResumeMatch = (resumeText, resumeSkills = [], job) => {
  const jobTitle = job.title || "";
  const jobDescription = job.description || "";
  const explicitRequirements = Array.isArray(job.requirements) ? job.requirements : [];

  // Extract skills from job description text
  const jobExtracted = extractSkillsAndEntities(`${jobTitle}\n${jobDescription}\n${explicitRequirements.join(" ")}`);
  
  // Combine explicit requirements and extracted skills into a unique list
  const allJobSkillsSet = new Set([
    ...explicitRequirements.map((s) => s.trim()).filter(Boolean),
    ...jobExtracted.skills,
  ]);
  const allJobSkills = Array.from(allJobSkillsSet);

  const normalizedResumeSkills = resumeSkills.map((s) => s.toLowerCase());
  const resumeTextLower = resumeText.toLowerCase();

  const matchedSkills = [];
  const missingSkills = [];

  allJobSkills.forEach((jobSkill) => {
    const jobSkillLower = jobSkill.toLowerCase();
    const inSkillsList = normalizedResumeSkills.includes(jobSkillLower);
    const inResumeText = resumeTextLower.includes(jobSkillLower);

    if (inSkillsList || inResumeText) {
      matchedSkills.push(jobSkill);
    } else {
      missingSkills.push(jobSkill);
    }
  });

  // Calculate heuristic score
  let score = 0;
  if (allJobSkills.length === 0) {
    score = 75; // Default baseline if job has no explicit skills
  } else {
    const skillMatchRatio = matchedSkills.length / allJobSkills.length;
    score = Math.round(skillMatchRatio * 85);

    // Give small bonus if job title keywords appear in resume
    const titleWords = jobTitle.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    const titleMatches = titleWords.filter((w) => resumeTextLower.includes(w)).length;
    if (titleWords.length > 0) {
      score += Math.round((titleMatches / titleWords.length) * 15);
    }
  }

  score = Math.min(100, Math.max(0, score));

  // Extract evidence snippets for up to 5 matched skills
  const evidence = [];
  const sentences = resumeText.split(/(?<=[.?!])\s+/);

  matchedSkills.slice(0, 5).forEach((skill) => {
    const skillLower = skill.toLowerCase();
    const foundSentence = sentences.find((s) => s.toLowerCase().includes(skillLower));
    if (foundSentence) {
      evidence.push({
        skill,
        snippet: foundSentence.trim().slice(0, 200),
      });
    }
  });

  // Generate actionable suggestions
  const suggestions = [];
  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 4).join(", ");
    suggestions.push(`Consider highlighting experience or personal projects involving: ${topMissing}.`);
  }
  if (score >= 80) {
    suggestions.push("Strong candidate match. Focus on system design and architectural trade-offs during interviews.");
  } else if (score >= 50) {
    suggestions.push("Moderate match. Review missing technical competencies and tailor your resume summary.");
  } else {
    suggestions.push("Low direct overlap. Emphasize transferable problem-solving skills and foundational knowledge.");
  }

  return {
    score,
    scoringVersion: "heuristic_v1",
    summary: {
      totalJobSkillsRequired: allJobSkills.length,
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
    },
    matchedSkills,
    missingSkills,
    evidence,
    suggestions,
    disclaimer: "This score is an algorithmic keyword heuristic, not a hiring prediction or certification.",
  };
};

module.exports = {
  calculateResumeMatch,
};
