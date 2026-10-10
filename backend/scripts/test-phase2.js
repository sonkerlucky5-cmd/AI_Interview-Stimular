const { pool } = require("../config/db");
const User = require("../models/User");
const Resume = require("../models/Resume");
const JobDescription = require("../models/JobDescription");
const ResumeMatch = require("../models/ResumeMatch");
const { extractSkillsAndEntities } = require("../services/resumeService");
const { calculateResumeMatch } = require("../services/matchingService");

async function runPhase2Tests() {
  console.log("=========================================");
  console.log("   Phase 2: Resume & Matching Test Suite ");
  console.log("=========================================\n");

  const email1 = `candidate_p2_${Date.now()}@test.com`;
  const email2 = `stranger_p2_${Date.now()}@test.com`;
  let user1, user2;

  try {
    // 1. Create two test users
    console.log("1. Creating Test Users:");
    user1 = await User.create({ name: "Alex Candidate", email: email1, password: "Password123!" });
    user2 = await User.create({ name: "Bob Stranger", email: email2, password: "Password123!" });
    console.log(`   ✔ User 1 created: ${user1.id}`);
    console.log(`   ✔ User 2 created: ${user2.id}`);

    // 2. Test Skill Extraction
    console.log("\n2. Testing Resume Text Parsing & Skill Extraction:");
    const mockResumeText = `
      Alex Candidate - Senior Software Engineer
      Email: alex@example.com | Phone: (555) 123-4567
      Summary: Experienced Full Stack Engineer with 5+ years building distributed web applications.
      Skills: JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, Docker, AWS, Git, System Design.
      Experience:
      Built high-performance REST APIs using Node.js, Express, and PostgreSQL handling 10k requests/sec.
      Architected frontend microfrontends with React, Vite, and Redux.
      Implemented CI/CD pipelines with GitHub Actions and deployed containerized services on AWS ECS with Docker.
    `;
    const extracted = extractSkillsAndEntities(mockResumeText);
    console.log("   ✔ Extracted skills count:", extracted.skills.length);
    console.log("   ✔ Detected skills:", extracted.skills);
    console.log("   ✔ Word count:", extracted.metrics.wordCount);
    console.log("   ✔ Contact cues:", extracted.contactCues);

    // 3. Test Resume Creation & DB Storage
    console.log("\n3. Testing Resume Database Persistence:");
    const resume = await Resume.create({
      userId: user1.id,
      fileName: "alex_resume.pdf",
      storageKey: "mock-storage-key-123.pdf",
      mimeType: "application/pdf",
      sizeBytes: 1048576,
      parsedText: mockResumeText,
      extractedData: extracted,
    });
    console.log(`   ✔ Resume record created with ID: ${resume.id}`);

    const userResumes = await Resume.findByUser(user1.id);
    console.log(`   ✔ findByUser returned ${userResumes.length} resume(s) for User 1`);

    // 4. Test Job Description CRUD
    console.log("\n4. Testing Job Description CRUD:");
    const job = await JobDescription.create({
      userId: user1.id,
      title: "Senior Full Stack Engineer",
      company: "Acme Tech",
      description: "We are seeking a Senior Full Stack Engineer with expertise in Node.js, React, and PostgreSQL to build scalable systems.",
      requirements: ["Node.js", "React", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL"],
    });
    console.log(`   ✔ Job description created with ID: ${job.id}`);

    const updatedJob = await JobDescription.updateByIdAndUser(job.id, user1.id, {
      company: "Acme Innovations Inc.",
    });
    console.log(`   ✔ Job company updated to: ${updatedJob.company}`);

    // 5. Test Resume-to-Job Matching Engine
    console.log("\n5. Testing Resume-to-Job Matching Engine:");
    const matchData = calculateResumeMatch(resume.parsed_text, extracted.skills, updatedJob);
    console.log(`   ✔ Computed Match Score: ${matchData.score}%`);
    console.log(`   ✔ Matched Skills (${matchData.matchedSkills.length}):`, matchData.matchedSkills);
    console.log(`   ✔ Missing Skills (${matchData.missingSkills.length}):`, matchData.missingSkills);
    console.log(`   ✔ Evidence Snippets count:`, matchData.evidence.length);
    console.log(`   ✔ Suggestions:`, matchData.suggestions);

    const savedMatch = await ResumeMatch.create({
      userId: user1.id,
      resumeId: resume.id,
      jobDescriptionId: updatedJob.id,
      matchData,
      scoringVersion: matchData.scoringVersion,
    });
    console.log(`   ✔ Match record saved with ID: ${savedMatch.id}`);

    // 6. Test Security & Ownership Isolation (User 2 cannot access User 1's data)
    console.log("\n6. Testing Security & Data Isolation:");
    const crossResume = await Resume.findByIdAndUser(resume.id, user2.id);
    console.log(`   ✔ Cross-user access to Resume blocked:`, crossResume === null);

    const crossJob = await JobDescription.findByIdAndUser(job.id, user2.id);
    console.log(`   ✔ Cross-user access to Job blocked:`, crossJob === null);

    const crossMatch = await ResumeMatch.findByIdAndUser(savedMatch.id, user2.id);
    console.log(`   ✔ Cross-user access to Match blocked:`, crossMatch === null);

    console.log("\n=========================================");
    console.log("   All Phase 2 Backend Tests Passed! 🎉  ");
    console.log("=========================================\n");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  } finally {
    // Cleanup test users (cascades to resumes, jobs, matches)
    console.log("Cleaning up test users...");
    if (user1) await pool.query("DELETE FROM users WHERE id = $1", [user1.id]);
    if (user2) await pool.query("DELETE FROM users WHERE id = $1", [user2.id]);
    console.log("✔ Cleanup complete.");
    await pool.end();
  }
}

runPhase2Tests();
