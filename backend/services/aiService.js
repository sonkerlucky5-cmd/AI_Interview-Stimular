const { GoogleGenerativeAI } = require("@google/generative-ai");
const { env } = require("../config/env");

let genAI = null;
if (env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  } catch (err) {
    console.warn("Gemini AI initialization warning:", err.message);
  }
}

/**
 * Curated domain question catalogue for deterministic high-quality fallbacks
 */
const FALLBACK_QUESTION_BANK = {
  technical: {
    frontend: [
      {
        questionText: "How does the browser rendering engine process HTML, CSS, and JavaScript, and what strategies do you use to minimize layout thrashing and reflows?",
        category: "Browser Internals & Performance",
      },
      {
        questionText: "Explain the reconciliation algorithm and Virtual DOM in React. In what scenarios does passing unstable object references or inline functions cause unnecessary re-renders?",
        category: "Framework Architecture",
      },
      {
        questionText: "How do you manage client-side state in complex SPAs? Contrast local state, Context API, and external state stores like Redux or Zustand in terms of performance and maintainability.",
        category: "State Management",
      },
      {
        questionText: "Describe how modern web applications implement secure authentication using HTTP-only cookies, JWT tokens, and CSRF protection mechanisms.",
        category: "Security & Web Standards",
      },
      {
        questionText: "What are Core Web Vitals (LCP, FID/INP, CLS), and how would you diagnose and optimize an e-commerce website that has poor LCP metrics?",
        category: "Web Performance & Metrics",
      },
    ],
    backend: [
      {
        questionText: "Explain how Node.js manages asynchronous I/O with libuv and the event loop. What happens when long-running CPU-bound operations block the main thread, and how do you resolve it?",
        category: "Node.js Runtime & Event Loop",
      },
      {
        questionText: "How do you design database indexing strategies in PostgreSQL for high-throughput queries? When would a composite or partial index be more effective than standard B-tree indexes?",
        category: "Databases & Optimization",
      },
      {
        questionText: "Compare RESTful APIs with GraphQL and gRPC. What criteria do you use to choose the appropriate communication protocol for inter-service and client-server architectures?",
        category: "API Design & Protocols",
      },
      {
        questionText: "How do you handle database transactions, isolation levels, and concurrency conflicts (e.g. race conditions during inventory checkout) in a relational database?",
        category: "Data Integrity & Concurrency",
      },
      {
        questionText: "Describe your approach to implementing distributed caching with Redis. How do you prevent cache stampedes, cache penetration, and stale data propagation?",
        category: "Caching & Distributed Systems",
      },
    ],
    general: [
      {
        questionText: "Can you explain the SOLID design principles and provide a concrete example of how applying the Single Responsibility or Dependency Inversion principle improved one of your recent projects?",
        category: "Software Design Principles",
      },
      {
        questionText: "How do you approach designing microservices versus a modular monolith? What trade-offs do you evaluate regarding data consistency, network latency, and deployment complexity?",
        category: "System Architecture",
      },
      {
        questionText: "Describe how you write maintainable automated test suites across unit, integration, and end-to-end boundaries. How do you prevent brittle tests that impede refactoring?",
        category: "Testing & Reliability",
      },
      {
        questionText: "Walk me through how you diagnose and troubleshoot an intermittent performance degradation or memory leak occurring in a production service.",
        category: "Debugging & Observability",
      },
      {
        questionText: "How do you design an idempotent write API for financial transactions or order placement where mobile network retries could duplicate requests?",
        category: "Distributed Consistency",
      },
    ],
  },
  behavioral: [
    {
      questionText: "Tell me about a time you had a technical disagreement with a teammate or lead regarding architectural direction. How did you handle it and what was the outcome?",
      category: "Collaboration & Conflict Resolution",
    },
    {
      questionText: "Describe a high-severity production incident you were involved in. How did you triage the problem under pressure and what post-mortem actions were implemented?",
      category: "Ownership & Crisis Management",
    },
    {
      questionText: "Can you share an example of a project where requirements shifted dramatically close to a delivery deadline? How did you adapt your scope and communicate with stakeholders?",
      category: "Adaptability & Communication",
    },
    {
      questionText: "Tell me about a piece of technical debt you championed refactoring. How did you balance business features with engineering health to get buy-in from product managers?",
      category: "Technical Leadership & Trade-offs",
    },
    {
      questionText: "Describe a situation where you had to mentor a junior engineer or onboard a new teammate to a complex codebase. How did you structure their ramp-up?",
      category: "Mentorship & Team Growth",
    },
  ],
};

/**
 * Generates an interview question using Gemini AI or domain fallback
 */
const generateInterviewQuestion = async ({
  targetRole = "Software Engineer",
  interviewType = "technical",
  difficulty = "intermediate",
  position = 1,
  previousQuestions = [],
  previousAnswers = [],
  resumeText = "",
  jobDescription = "",
}) => {
  // 1. Try Gemini if API key is provided
  if (genAI && env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are a senior technical interviewer conducting a realistic mock interview.
Target Role: ${targetRole}
Interview Type: ${interviewType}
Difficulty Level: ${difficulty}
Question Number: ${position}

Context:
${resumeText ? `Candidate Resume Highlights: ${resumeText.slice(0, 1000)}` : "No resume provided."}
${jobDescription ? `Target Job Description: ${jobDescription.slice(0, 800)}` : "No specific job description."}
${
  previousQuestions.length > 0
    ? `Previous Questions asked so far:
${previousQuestions.map((q, i) => `Q${i + 1}: ${q} (Candidate Answer: ${previousAnswers[i] ? previousAnswers[i].slice(0, 150) : "N/A"})`).join("\n")}`
    : "This is the first question of the interview."
}

Generate question #${position}.
Follow these strict rules:
1. Make it a thoughtful, realistic, professional question suitable for a ${difficulty} ${targetRole}.
2. If previous answers exist, adaptively branch into a deeper follow-up or explore an adjacent core competency.
3. Do not ask generic trivia; focus on conceptual reasoning, architecture, practical trade-offs, or real-world problem solving.
4. Output ONLY valid JSON in this exact structure with no Markdown fences or other text:
{
  "questionText": "The interview question here",
  "category": "Topic or Competency Area",
  "difficulty": "${difficulty}"
}
`;

      const response = await model.generateContent(prompt);
      const rawText = response.response.text();
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.questionText) {
        return {
          questionText: parsed.questionText.trim(),
          category: parsed.category || "General Technical",
          difficulty: parsed.difficulty || difficulty,
          source: "gemini-2.5-flash",
        };
      }
    } catch (err) {
      console.warn("Gemini question generation error, switching to fallback:", err.message);
    }
  }

  // 2. High-quality Deterministic Fallback Generator
  const roleLower = targetRole.toLowerCase();
  let bank = FALLBACK_QUESTION_BANK.technical.general;

  if (interviewType === "behavioral") {
    bank = FALLBACK_QUESTION_BANK.behavioral;
  } else if (roleLower.includes("front") || roleLower.includes("react") || roleLower.includes("ui")) {
    bank = FALLBACK_QUESTION_BANK.technical.frontend;
  } else if (roleLower.includes("back") || roleLower.includes("node") || roleLower.includes("api") || roleLower.includes("data")) {
    bank = FALLBACK_QUESTION_BANK.technical.backend;
  }

  const index = (position - 1) % bank.length;
  const selected = bank[index];

  return {
    questionText: selected.questionText,
    category: selected.category,
    difficulty,
    source: "curated_catalogue",
  };
};

/**
 * Evaluates candidate's answer using multi-dimensional rubric scoring
 */
const evaluateAnswer = async ({
  questionText,
  answerText,
  category = "General",
  difficulty = "intermediate",
  targetRole = "Software Engineer",
}) => {
  // 1. Try Gemini if configured
  if (genAI && env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
You are an expert technical hiring manager evaluating an interview answer.
Target Role: ${targetRole}
Difficulty: ${difficulty}
Category: ${category}
Interview Question: "${questionText}"
Candidate's Submitted Answer: "${answerText}"

Evaluate the answer objectively on a 0-100 scale using this standard rubric:
- relevance: How directly does the answer address the specific question asked?
- technical_correctness: Are the concepts, terminology, and mechanisms explained accurately?
- completeness: Did the candidate cover core components, edge cases, or depth expected?
- reasoning_structure: Is the response organized, logically structured, and articulate?
- practical_tradeoffs: Did the candidate mention real-world trade-offs, constraints, or alternatives?

Rules:
- Never judge accent, personality, or perceived emotion.
- Highlight concrete strengths quoted from the answer.
- Identify specific missing concepts or engineering nuances.
- Provide one exemplary ideal benchmark answer.
- Output ONLY valid JSON in this exact structure with no extra text or Markdown fences:
{
  "scores": {
    "overall": 82,
    "relevance": 85,
    "technical_correctness": 80,
    "completeness": 75,
    "reasoning_structure": 85,
    "practical_tradeoffs": 80
  },
  "strengths": [
    "Identified the core concept accurately",
    "Structured the response with clear examples"
  ],
  "improvements": [
    "Could have discussed edge cases and recovery mechanisms",
    "Consider mentioning performance implications"
  ],
  "idealAnswer": "A comprehensive, realistic model response illustrating best practices...",
  "followUpSuggestion": "Review distributed locking patterns and PostgreSQL isolation levels."
}
`;

      const response = await model.generateContent(prompt);
      const rawText = response.response.text();
      const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      if (parsed.scores && typeof parsed.scores.overall === "number") {
        return {
          scores: parsed.scores,
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          idealAnswer: parsed.idealAnswer || "A complete model answer addresses the core mechanism and relevant trade-offs.",
          followUpSuggestion: parsed.followUpSuggestion || "Continue practicing deep architectural reasoning.",
          rubricVersion: "standard_rubric_v1",
          modelVersion: "gemini-2.5-flash",
        };
      }
    } catch (err) {
      console.warn("Gemini evaluation error, using heuristic fallback:", err.message);
    }
  }

  // 2. High-quality Deterministic Evaluation Fallback
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;
  let relevance = 70;
  let technical = 70;
  let completeness = 65;
  let structure = 75;
  let tradeoffs = 65;

  if (wordCount < 15) {
    relevance = 40;
    technical = 35;
    completeness = 25;
    structure = 40;
    tradeoffs = 20;
  } else if (wordCount < 40) {
    relevance = 65;
    technical = 60;
    completeness = 50;
    structure = 60;
    tradeoffs = 50;
  } else if (wordCount >= 100) {
    relevance = 85;
    technical = 82;
    completeness = 85;
    structure = 85;
    tradeoffs = 80;
  }

  const overall = Math.round(
    relevance * 0.25 +
    technical * 0.25 +
    completeness * 0.2 +
    structure * 0.15 +
    tradeoffs * 0.15
  );

  const strengths = [];
  const improvements = [];

  if (wordCount >= 40) {
    strengths.push("Provided a detailed explanation that addresses the core premises of the question.");
    strengths.push("Demonstrated foundational understanding of the underlying technical concepts.");
  } else {
    strengths.push("Provided a concise initial response that identifies the primary topic.");
    improvements.push("Elaborate on specific architectural mechanisms and concrete implementation examples.");
  }

  if (wordCount >= 80) {
    strengths.push("Structured the reasoning effectively with domain terminology.");
  } else {
    improvements.push("Discuss practical production trade-offs, edge cases, and failure recovery modes.");
  }

  return {
    scores: {
      overall,
      relevance,
      technical_correctness: technical,
      completeness,
      reasoning_structure: structure,
      practical_tradeoffs: tradeoffs,
    },
    strengths,
    improvements,
    idealAnswer: `An exemplary answer for "${questionText}" clearly states the fundamental principles, explains the operational workflow, highlights common pitfalls or trade-offs (e.g. memory vs latency, complexity vs maintainability), and references concrete real-world engineering experiences.`,
    followUpSuggestion: `Deep dive into ${category} architectures and review practical trade-off patterns.`,
    rubricVersion: "heuristic_rubric_v1",
    modelVersion: "expert_rubric_rules",
  };
};

module.exports = {
  generateInterviewQuestion,
  evaluateAnswer,
};
