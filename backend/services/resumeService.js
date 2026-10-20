const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const ApiError = require("../utils/ApiError");

const KNOWN_SKILLS = [
  // Programming Languages
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Golang", "Rust", 
  "Ruby", "PHP", "Swift", "Kotlin", "SQL", "HTML", "HTML5", "CSS", "CSS3",
  
  // Frontend
  "React", "React.js", "Next.js", "Vue", "Vue.js", "Angular", "Svelte", 
  "Redux", "Tailwind", "Tailwind CSS", "Bootstrap", "Vite", "Webpack",
  
  // Backend & APIs
  "Node.js", "Express", "Express.js", "NestJS", "Django", "Flask", "FastAPI", 
  "Spring", "Spring Boot", "ASP.NET", ".NET", "GraphQL", "REST APIs", "RESTful API",
  
  // Databases & Caching
  "PostgreSQL", "Postgres", "MongoDB", "MySQL", "Redis", "SQLite", 
  "DynamoDB", "Elasticsearch", "Prisma", "Mongoose", "TypeORM",
  
  // Cloud & DevOps
  "AWS", "Amazon Web Services", "Azure", "GCP", "Google Cloud", 
  "Docker", "Kubernetes", "K8s", "CI/CD", "Git", "GitHub", "GitLab", 
  "Terraform", "Linux", "Nginx", "Serverless",
  
  // Methodologies & Concepts
  "System Design", "Microservices", "Data Structures", "Algorithms", "DSA", 
  "Object-Oriented Programming", "OOP", "Design Patterns", "Agile", "Scrum", 
  "Unit Testing", "Jest", "TDD", "CI/CD Pipelines", "WebSockets"
];

/**
 * Extracts plain text from an uploaded resume file (PDF or DOCX).
 */
const extractTextFromFile = async (filePath, mimeType) => {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".pdf" || mimeType === "application/pdf") {
      const dataBuffer = await fs.promises.readFile(filePath);
      let extractedText = "";

      const PDFParserClass =
        pdfParse.PDFParse ||
        (typeof pdfParse === "function" && pdfParse.prototype?.getText ? pdfParse : null);

      if (PDFParserClass) {
        const parser = new PDFParserClass({ data: dataBuffer });
        try {
          const result = await parser.getText();
          extractedText = result?.text || "";
        } finally {
          if (typeof parser.destroy === "function") {
            await parser.destroy().catch(() => {});
          }
        }
      } else if (typeof pdfParse === "function") {
        const result = await pdfParse(dataBuffer);
        extractedText = result?.text || "";
      } else {
        throw new ApiError(500, "PDF parsing engine is not properly initialized.", "PARSER_INIT_ERROR");
      }

      if (!extractedText || !extractedText.trim()) {
        throw new ApiError(400, "Unable to extract text. The PDF might be scanned or image-only.", "SCANNED_PDF_ERROR");
      }
      return extractedText.trim();
    } else if (ext === ".docx" || mimeType?.includes("wordprocessingml")) {
      const result = await mammoth.extractRawText({ path: filePath });
      if (!result.value || !result.value.trim()) {
        throw new ApiError(400, "Unable to extract text from DOCX file.", "EMPTY_DOCX_ERROR");
      }
      return result.value.trim();
    } else {
      throw new ApiError(400, "Unsupported resume file type for parsing.", "UNSUPPORTED_FILE_TYPE");
    }
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(400, `Failed to parse resume: ${err.message}`, "RESUME_PARSE_ERROR");
  }
};

/**
 * Heuristically extracts skills and structured metrics from resume text.
 */
const extractSkillsAndEntities = (text) => {
  const normalizedText = ` ${text.toLowerCase()} `;
  const foundSkills = new Set();

  KNOWN_SKILLS.forEach((skill) => {
    const escaped = skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match whole words only
    const regex = new RegExp(`(?:^|[\\s,.;:()/\\[\\]-])${escaped}(?:$|[\\s,.;:()/\\[\\]-])`, "i");
    if (regex.test(normalizedText)) {
      foundSkills.add(skill);
    }
  });

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  // Simple email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // Simple phone extraction
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : null;

  return {
    skills: Array.from(foundSkills).sort(),
    metrics: {
      wordCount,
      charCount,
      estimatedReadingMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    },
    contactCues: {
      hasEmail: Boolean(email),
      hasPhone: Boolean(phone),
    },
  };
};

module.exports = {
  extractTextFromFile,
  extractSkillsAndEntities,
};
