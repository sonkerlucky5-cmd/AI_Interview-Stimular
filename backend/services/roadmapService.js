const { GoogleGenerativeAI } = require("@google/generative-ai");
const { env } = require("../config/env");

let genAI = null;
if (env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err) {
    console.warn("Gemini AI initialization warning for roadmap:", err.message);
  }
}

const VETTED_RESOURCES = {
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  react: "https://react.dev/learn",
  nodejs: "https://nodejs.org/docs/latest/api/",
  postgresql: "https://www.postgresql.org/docs/current/",
  sql: "https://www.postgresql.org/docs/current/tutorial-sql.html",
  docker: "https://docs.docker.com/get-started/",
  redis: "https://redis.io/docs/",
  system_design: "https://github.com/donnemartin/system-design-primer",
  security: "https://owasp.org/www-project-top-ten/",
  typescript: "https://www.typescriptlang.org/docs/handbook/intro.html",
  git: "https://git-scm.com/doc",
  graphql: "https://graphql.org/learn/",
};

const getResourceForTopic = (topic = "") => {
  const lower = topic.toLowerCase();
  for (const [key, url] of Object.entries(VETTED_RESOURCES)) {
    if (lower.includes(key)) return url;
  }
  return "https://developer.mozilla.org/en-US/";
};

const generateDeterministicCurriculum = ({
  targetRole = "Software Engineer",
  skillGaps = [],
  availableMinutesPerDay = 45,
  learningStyle = "balanced",
}) => {
  const gaps =
    skillGaps && skillGaps.length > 0
      ? skillGaps
      : ["System Design", "Database Optimization", "Error Handling", "Testing"];

  const stages = [
    {
      stage: "Stage 1: Core Fundamentals & Concept Mastery",
      topics: [
        {
          topic: `${gaps[0] || "Architecture"} Core Fundamentals`,
          task: `Study the internal mechanisms, lifecycle, and underlying execution model of ${gaps[0] || "system components"}.`,
          estimatedMinutes: availableMinutesPerDay,
          practiceOutcome: `Able to articulate core terminology, architecture, and common pitfalls without hesitating.`,
          resourceUrl: getResourceForTopic(gaps[0] || "javascript"),
        },
        {
          topic: `${gaps[1] || "Data Modeling"} Best Practices`,
          task: `Review schema patterns, normalization vs denormalization, and query optimization for ${gaps[1] || "data storage"}.`,
          estimatedMinutes: Math.min(availableMinutesPerDay, 40),
          practiceOutcome: `Capable of structuring resilient schemas and identifying N+1 query antipatterns.`,
          resourceUrl: getResourceForTopic(gaps[1] || "postgresql"),
        },
      ],
    },
    {
      stage: "Stage 2: Architecture & Applied Problem Solving",
      topics: [
        {
          topic: `${gaps[2] || "Scalability"} & System Trade-offs`,
          task: `Analyze high-concurrency scenarios, caching strategies (write-through vs cache-aside), and backpressure.`,
          estimatedMinutes: availableMinutesPerDay,
          practiceOutcome: `Draft an architectural blueprint defending latency, cost, and consistency trade-offs.`,
          resourceUrl: getResourceForTopic("system_design"),
        },
        {
          topic: `${gaps[3] || "Production Resilience"} & Security`,
          task: `Implement defensive validation, rate limiting, and structured error handling for distributed endpoints.`,
          estimatedMinutes: Math.min(availableMinutesPerDay, 45),
          practiceOutcome: `Prevent OWASP top vulnerabilities, unhandled rejections, and cascading failures.`,
          resourceUrl: getResourceForTopic("security"),
        },
      ],
    },
    {
      stage: "Stage 3: Hands-on Implementation & Edge Cases",
      topics: [
        {
          topic: `End-to-End ${targetRole} Mini-Project`,
          task: `Build a production-grade feature combining ${gaps.slice(0, 2).join(" & ") || "core services"} with automated test coverage.`,
          estimatedMinutes: availableMinutesPerDay * 2,
          practiceOutcome: `Have working runnable code and demonstrable test suites ready to explain to interviewers.`,
          resourceUrl: getResourceForTopic("nodejs"),
        },
        {
          topic: "Benchmark & Performance Profiling",
          task: `Profile memory usage, execution times, and bundle size/network payload under simulated load.`,
          estimatedMinutes: availableMinutesPerDay,
          practiceOutcome: `Identify bottlenecks using profiling tools and provide before/after optimization metrics.`,
          resourceUrl: getResourceForTopic(gaps[0] || "javascript"),
        },
      ],
    },
    {
      stage: "Stage 4: Mock Defense & Interview Readiness",
      topics: [
        {
          topic: "Behavioral & Architecture Whiteboarding",
          task: `Practice explaining technical trade-offs out loud using STAR method and diagrammatic system flows.`,
          estimatedMinutes: 45,
          practiceOutcome: `Deliver a concise, senior-level pitch justifying technology choices and edge-case fallbacks.`,
          resourceUrl: getResourceForTopic("system_design"),
        },
        {
          topic: "Final Full-Length Mock Simulation",
          task: `Complete a 5-question adaptive mock interview on AI Interview Simulator to test comprehension under time pressure.`,
          estimatedMinutes: 45,
          practiceOutcome: `Achieve an evaluated rubric score above 80% across all technical dimensions.`,
          resourceUrl: "https://developer.mozilla.org/",
        },
      ],
    },
  ];

  let position = 1;
  const items = [];

  stages.forEach((stg) => {
    stg.topics.forEach((t) => {
      items.push({
        position: position++,
        stage: stg.stage,
        topic: t.topic,
        task: t.task,
        estimatedMinutes: t.estimatedMinutes,
        practiceOutcome: t.practiceOutcome,
        resourceUrl: t.resourceUrl,
        status: "pending",
      });
    });
  });

  return items;
};

const generateLearningRoadmap = async ({
  targetRole = "Software Engineer",
  skillGaps = [],
  availableMinutesPerDay = 45,
  learningStyle = "balanced",
  targetWeeks = 4,
}) => {
  if (!genAI) {
    return generateDeterministicCurriculum({
      targetRole,
      skillGaps,
      availableMinutesPerDay,
      learningStyle,
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are an expert engineering career coach. Generate a structured, realistic personal study roadmap for a candidate preparing for the role of "${targetRole}".

Identified Technical Skill Gaps / Weaknesses:
${skillGaps.length > 0 ? skillGaps.join(", ") : "Core Architecture, Scalability, System Design, Data Structures"}

Candidate Preferences:
- Daily Study Time: ${availableMinutesPerDay} minutes/day
- Target Timeline: ${targetWeeks} weeks
- Learning Style: ${learningStyle} (e.g. hands-on, balanced, deep-dive)

Guidelines:
1. Divide the roadmap into 3 to 4 sequential stages (e.g. "Stage 1: Core Fundamentals", "Stage 2: Applied Architecture", etc.).
2. For each stage, generate 2 to 3 concrete, high-yield actionable tasks.
3. Every task MUST have:
   - "topic": concise name of the subject
   - "task": specific action item to study or build (not generic like "learn react")
   - "estimatedMinutes": number matching daily availability (${Math.max(20, availableMinutesPerDay)})
   - "practiceOutcome": what the candidate will demonstrably know or have built
   - "stage": the name of the stage (e.g. "Stage 1: ...")
4. Do NOT make up invalid URLs. Use official documentation names or domains.
5. Return ONLY a valid JSON array of tasks matching this schema:
[
  {
    "stage": "Stage 1: Foundations",
    "topic": "...",
    "task": "...",
    "estimatedMinutes": 45,
    "practiceOutcome": "..."
  }
]
`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item, index) => ({
        position: index + 1,
        stage: item.stage || "Stage 1",
        topic: item.topic || `Topic ${index + 1}`,
        task: item.task || "Study core concepts and implement practical examples.",
        estimatedMinutes: item.estimatedMinutes || availableMinutesPerDay,
        practiceOutcome: item.practiceOutcome || "Mastery of target concept.",
        resourceUrl: getResourceForTopic(item.topic || ""),
        status: "pending",
      }));
    }

    return generateDeterministicCurriculum({
      targetRole,
      skillGaps,
      availableMinutesPerDay,
      learningStyle,
    });
  } catch (err) {
    console.warn("Gemini roadmap generation fallback triggered:", err.message);
    return generateDeterministicCurriculum({
      targetRole,
      skillGaps,
      availableMinutesPerDay,
      learningStyle,
    });
  }
};

module.exports = {
  generateLearningRoadmap,
  generateDeterministicCurriculum,
  VETTED_RESOURCES,
};
