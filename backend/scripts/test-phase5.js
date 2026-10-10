require("dotenv").config();
const { query } = require("../config/db");
const User = require("../models/User");
const LearningPlan = require("../models/LearningPlan");
const { generateLearningRoadmap } = require("../services/roadmapService");

async function runTest() {
  console.log("=========================================");
  console.log("   Phase 5: Personalized Learning Plan   ");
  console.log("=========================================\n");

  const testEmail1 = `cand1_phase5_${Date.now()}@test.com`;
  const testEmail2 = `cand2_phase5_${Date.now()}@test.com`;
  let user1, user2;

  try {
    // 1. Create Test Candidates
    console.log("1. Creating Test Candidates:");
    user1 = await User.create({ name: "Candidate 1", email: testEmail1, password: "Password123!" });
    console.log(`   ✔ Candidate 1: ${user1.id}`);

    user2 = await User.create({ name: "Candidate 2", email: testEmail2, password: "Password123!" });
    console.log(`   ✔ Candidate 2: ${user2.id}\n`);

    // 2. Generate Roadmap Curriculum
    console.log("2. Generating Learning Roadmap Curriculum:");
    const generatedItems = await generateLearningRoadmap({
      targetRole: "Full Stack Engineer",
      skillGaps: ["System Design", "PostgreSQL", "Docker"],
      availableMinutesPerDay: 45,
      learningStyle: "balanced",
    });
    console.log(`   ✔ Generated ${generatedItems.length} roadmap items across stages.`);

    // 3. Create Learning Plan Record & Save Items
    console.log("\n3. Creating Plan in Database:");
    const plan = await LearningPlan.create({
      userId: user1.id,
      targetRole: "Full Stack Engineer",
      availableMinutesPerDay: 45,
      skillGaps: ["System Design", "PostgreSQL", "Docker"],
      learningStyle: "balanced",
    });
    console.log(`   ✔ Plan created with ID: ${plan.id}`);

    const items = await LearningPlan.createItems(plan.id, generatedItems);
    console.log(`   ✔ Persisted ${items.length} plan items into database.`);

    // 4. Retrieve Full Plan with Items
    console.log("\n4. Retrieving Full Plan:");
    const fullPlan = await LearningPlan.findById(plan.id, user1.id);
    console.log(`   ✔ Found plan: "${fullPlan.title}"`);
    console.log(`   ✔ Total Items: ${fullPlan.totalItems}, Progress: ${fullPlan.progressPercentage}%`);
    if (fullPlan.totalItems !== generatedItems.length) {
      throw new Error(`Expected ${generatedItems.length} items, found ${fullPlan.totalItems}`);
    }

    // 5. Toggle Item Completion
    console.log("\n5. Updating Task Item Status:");
    const firstItem = fullPlan.items[0];
    const updatedItem = await LearningPlan.updateItem(firstItem.id, plan.id, user1.id, {
      status: "completed",
      notes: "Reviewed indexing concepts and ran EXPLAIN ANALYZE.",
    });
    console.log(`   ✔ Updated item status to: ${updatedItem.status}`);
    console.log(`   ✔ Completed at timestamp set: ${Boolean(updatedItem.completed_at)}`);

    const reloadedPlan = await LearningPlan.findById(plan.id, user1.id);
    console.log(`   ✔ Recalculated Progress: ${reloadedPlan.progressPercentage}% (${reloadedPlan.completedItems}/${reloadedPlan.totalItems})`);
    if (reloadedPlan.completedItems !== 1) {
      throw new Error(`Expected 1 completed item, found ${reloadedPlan.completedItems}`);
    }

    // 6. Adding a Custom Task
    console.log("\n6. Adding Custom Task Item:");
    const customItem = await LearningPlan.addItem(plan.id, user1.id, {
      topic: "Kafka Event Streaming",
      task: "Build message producer and consumer with DLQ handling",
      estimatedMinutes: 60,
      stage: "Custom Electives",
      practiceOutcome: "Decoupled async architecture",
    });
    console.log(`   ✔ Custom item created: "${customItem.topic}" (pos: ${customItem.position})`);

    // 7. Plan Regeneration Preserving Completed Tasks
    console.log("\n7. Testing Roadmap Regeneration (Preserving Completed):");
    const freshCurriculum = await generateLearningRoadmap({
      targetRole: "Full Stack Engineer",
      skillGaps: ["PostgreSQL", "Kubernetes"],
      availableMinutesPerDay: 45,
      learningStyle: "hands-on",
    });

    const regeneratedPlan = await LearningPlan.regeneratePlanPreservingCompleted(
      plan.id,
      user1.id,
      freshCurriculum
    );

    const hasOriginalCompleted = regeneratedPlan.items.some(
      (it) => it.id === firstItem.id && it.status === "completed"
    );
    console.log(`   ✔ Completed task preserved: ${hasOriginalCompleted}`);
    console.log(`   ✔ New total items: ${regeneratedPlan.totalItems}`);
    if (!hasOriginalCompleted) {
      throw new Error("Failed to preserve completed task during regeneration!");
    }

    // 8. Test Data Isolation Scoping
    console.log("\n8. Testing User Scoping & Data Isolation:");
    const crossPlan = await LearningPlan.findById(plan.id, user2.id);
    console.log(`   ✔ Cross-user access blocked: ${crossPlan === null}`);

    const crossUpdate = await LearningPlan.updateItem(firstItem.id, plan.id, user2.id, {
      status: "pending",
    });
    console.log(`   ✔ Cross-user item update blocked: ${crossUpdate === null}`);

    const user2Plans = await LearningPlan.findByUser(user2.id);
    console.log(`   ✔ Candidate 2 sees ${user2Plans.length} plans (expected 0)`);
    if (user2Plans.length !== 0) {
      throw new Error("Data leakage detected between candidates!");
    }

    console.log("\n=========================================");
    console.log("   All Phase 5 Backend Tests Passed! 🎉  ");
    console.log("=========================================\n");
  } catch (err) {
    console.error("❌ Test Failed:", err);
    process.exit(1);
  } finally {
    console.log("Cleaning up test users...");
    if (user1) await query("DELETE FROM users WHERE id = $1::uuid", [user1.id]);
    if (user2) await query("DELETE FROM users WHERE id = $1::uuid", [user2.id]);
    console.log("✔ Cleanup complete.");
    process.exit(0);
  }
}

runTest();
