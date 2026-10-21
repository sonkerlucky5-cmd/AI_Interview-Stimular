// ═════════════════════════════════════════════════════
// MOCK DATA FOR INTERVIEW AI APPLICATION
// ═════════════════════════════════════════════════════

export const faqItems = [
  {
    q: "How does the AI evaluate my interview responses?",
    a: "Our evaluator uses industry-calibrated engineering rubrics across 5 dimensions: Technical Accuracy, System Depth, Reasoning Structure, Trade-off Analysis, and Communication Clarity. You receive instant constructive score breakdowns and benchmark model responses.",
  },
  {
    q: "Is speech recognition supported in the interview room?",
    a: "Yes! You can speak your answers directly using browser WebSpeech dictation. Your audio is transcribed in real-time, and zero raw audio files are stored on our servers, ensuring total privacy.",
  },
  {
    q: "Can I attach my resume or target job description?",
    a: "Absolutely. You can upload PDF or DOCX resumes and target job listings. Our parser analyzes skill overlap, identifies experience gaps, and tailors the interview questions to match your exact target role.",
  },
  {
    q: "What difficulty levels and engineering tracks are covered?",
    a: "We support Junior, Mid-Level, Senior, and Staff/Lead tracks across Full Stack, Frontend (React), Backend (Node.js/Go), System Architecture, Cloud/DevOps, and Behavioral rounds.",
  },
  {
    q: "How does the personalized learning roadmap work?",
    a: "After each interview session or resume analysis, the platform detects skill gaps and synthesizes a staged study roadmap with daily time budgets and vetted documentation links.",
  },
];

export const features = [
  {
    icon: "⚡",
    title: "Real-Time AI Evaluator",
    description: "Gemini-powered feedback evaluating technical depth, algorithm complexity, and communication clarity instantly.",
    tag: "Instant Rubric",
  },
  {
    icon: "🎯",
    title: "Role-Specific Questions",
    description: "Target Frontend (React), Backend (Node/Go), System Design, or HR Behavioral rounds calibrated to your target seniority.",
    tag: "Targeted",
  },
  {
    icon: "💻",
    title: "Interactive DSA Arena",
    description: "Curated problem bank with real-time test verification, time complexity auditing, and hint assistance.",
    tag: "DSA Practice",
  },
  {
    icon: "📊",
    title: "Competency Radar & Analytics",
    description: "Track performance across rounds, identify weak spots, and monitor progress streaks with visual breakdowns.",
    tag: "Deep Insights",
  },
];

export const howItWorksSteps = [
  {
    step: "01",
    title: "Select Role & Seniority",
    desc: "Pick your focus track (Frontend, Backend, DSA, or Behavioral) and select Junior, Mid-Level, or Senior difficulty.",
    badge: "1 Click",
  },
  {
    step: "02",
    title: "Simulate Live Interview",
    desc: "Face adaptive questions where the AI listens, questions edge-case reasoning, and challenges design trade-offs.",
    badge: "Live Interactive",
  },
  {
    step: "03",
    title: "Instant Scoring & Action Plan",
    desc: "Receive deep score breakdown across 4 key dimensions with tailored suggestions and learning milestones.",
    badge: "Actionable",
  },
];

export const pricingPlans = [
  {
    id: "free",
    name: "Free Starter",
    price: "$0",
    period: "forever",
    description: "Ideal for getting started with mock interviews and basic DSA practice.",
    features: [
      "3 AI Mock Interviews / month",
      "50 Curated DSA Problems",
      "Basic Rubric & Score Breakdown",
      "Community Discord Access",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Engineer",
    price: "$19",
    period: "per month",
    description: "For active job seekers targeting tier-1 tech companies and high-growth startups.",
    features: [
      "Unlimited AI Mock Interviews",
      "All 300+ DSA Problems with Solutions",
      "Detailed Audio & Speech Analytics",
      "System Design & Architecture Mode",
      "Personalized Learning Roadmap",
    ],
    cta: "Go Pro",
    popular: true,
  },
  {
    id: "team",
    name: "Team & University",
    price: "$49",
    period: "per seat / mo",
    description: "For bootcamps, university cohorts, and engineering teams training talent.",
    features: [
      "Everything in Pro",
      "Cohort Performance Analytics",
      "Custom Question Bank Creation",
      "Dedicated Mentor Review Portal",
      "Priority API Processing",
    ],
    cta: "Contact Team",
    popular: false,
  },
];

export const dsaProblems = [
  {
    id: "two-sum",
    title: "Two Sum",
    topic: "Arrays & Hashing",
    difficulty: "Easy",
    solved: true,
    acceptance: "52.4%",
  },
  {
    id: "lru-cache",
    title: "LRU Cache Implementation",
    topic: "Linked List & Map",
    difficulty: "Medium",
    solved: true,
    acceptance: "41.8%",
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "Two Pointers",
    difficulty: "Hard",
    solved: false,
    acceptance: "60.2%",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    solved: true,
    acceptance: "44.9%",
  },
  {
    id: "course-schedule",
    title: "Course Schedule (Topological Sort)",
    topic: "Graphs",
    difficulty: "Medium",
    solved: false,
    acceptance: "47.1%",
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    topic: "Heap / Priority Queue",
    difficulty: "Hard",
    solved: false,
    acceptance: "51.3%",
  },
  {
    id: "best-time-buy-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topic: "Dynamic Programming",
    difficulty: "Easy",
    solved: true,
    acceptance: "54.1%",
  },
  {
    id: "coin-change",
    title: "Coin Change (Min Coins)",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    solved: false,
    acceptance: "43.5%",
  },
];

export const mockQuestions = [
  {
    id: 1,
    role: "Frontend",
    question: "Can you explain how React's Virtual DOM reconciliation algorithm works, and how keys optimize list re-rendering?",
    category: "React Internals",
    expectedKeywords: ["fiber", "diffing algorithm", "heuristic O(n)", "unmount", "reconciliation"],
  },
  {
    id: 2,
    role: "Frontend",
    question: "What is the difference between useMemo, useCallback, and React.memo? When would premature optimization actually hurt performance?",
    category: "Performance Optimization",
    expectedKeywords: ["referential equality", "overhead", "dependency array", "shallow compare"],
  },
  {
    id: 3,
    role: "Frontend",
    question: "Explain the CSS Box Model, stacking context creation, and the difference between reflow and repaint.",
    category: "Browser Rendering",
    expectedKeywords: ["layout", "composite", "z-index", "transform", "will-change"],
  },
  {
    id: 4,
    role: "Backend",
    question: "Explain how Node.js handles asynchronous I/O with libuv and the Event Loop phases.",
    category: "Node.js Runtime",
    expectedKeywords: ["microtask", "poll phase", "timer", "threadpool", "epoll"],
  },
  {
    id: 5,
    role: "Backend",
    question: "How do you design a high-throughput caching tier using Redis to prevent Cache Stampede and Cache Penetration?",
    category: "System Design",
    expectedKeywords: ["bloom filter", "mutex lock", "probabilistic early expiration", "ttl"],
  },
];

export const mockEvaluationResult = {
  overallScore: 92,
  interviewId: "sess_ai_7781",
  targetRole: "Frontend Engineer (React)",
  date: "Today, 4:30 PM",
  skills: [
    { name: "Technical Accuracy & Depth", score: 94, color: "#00ffd0" },
    { name: "System Architecture & Trade-offs", score: 88, color: "#7b61ff" },
    { name: "Communication & STAR Articulation", score: 92, color: "#ff6ec7" },
    { name: "Problem Solving & Edge Cases", score: 95, color: "#38bdf8" },
  ],
  aiSuggestions: [
    "Excellent explanation of Fiber reconciliation and heuristic O(n) tree diffing.",
    "Recommend explicitly mentioning concrete memory overhead benchmarks when using useCallback everywhere.",
    "Great confidence and structure; pacing was concise and easy to follow.",
  ],
};

export const adminStats = {
  totalUsers: 14820,
  interviewsCompleted: 58340,
  averagePlatformScore: "87.4%",
  activeSessionsNow: 342,
};

export const adminUsers = [
  { id: "usr_1", name: "Aarav Sharma", email: "aarav@dev.io", role: "Candidate", interviews: 14, status: "Active" },
  { id: "usr_2", name: "Priya Nair", email: "priya@tech.co", role: "Candidate", interviews: 22, status: "Active" },
  { id: "usr_3", name: "Rohan Gupta", email: "rohan@cloud.net", role: "Candidate", interviews: 8, status: "Pending" },
  { id: "usr_4", name: "Ananya Roy", email: "ananya@ai.org", role: "Admin", interviews: 35, status: "Active" },
  { id: "usr_5", name: "Vikram Mehta", email: "vikram@code.in", role: "Candidate", interviews: 11, status: "Active" },
];
