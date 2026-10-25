# NEXA AI — Model Context Protocol (MCP) Server

Production-ready Model Context Protocol (MCP) server providing external LLMs (Claude Desktop, Cursor, Antigravity, and custom agentic frameworks) with real-time access to the **NEXA AI Simulation Engine**, evaluation rubrics, code execution audits, and learning roadmaps.

---

## 1. Quickstart Configuration

### Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nexa-ai": {
      "command": "node",
      "args": [
        "c:/Users/HP/OneDrive/Desktop/AI_Interview Simulator/mcp/server.js"
      ]
    }
  }
}
```

### Cursor or Antigravity
Add to your MCP settings or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "nexa-ai": {
      "command": "node",
      "args": ["mcp/server.js"]
    }
  }
}
```

---

## 2. Available Tools (10 Production Tools)

| Tool Name | Description |
| :--- | :--- |
| `nexa_get_interview_categories` | Lists all supported tracks (Frontend, Backend, System Architecture, DSA, Behavioral) and seniority levels. |
| `nexa_start_mock_interview` | Initiates an adaptive AI interview session with calibrated questions and rubric expectations. |
| `nexa_submit_candidate_answer` | Evaluates candidate answer against 5-dimensional rubrics with Gemini AI scoring. |
| `nexa_get_evaluation_rubric` | Returns scoring criteria across Technical Depth, Architecture, Communication, and Edge Cases. |
| `nexa_get_dsa_problems` | Retrieves curated algorithmic challenges with test cases, hints, and complexity benchmarks. |
| `nexa_run_code_execution` | Validates and benchmarks candidate code against automated test suites. |
| `nexa_analyze_resume_ats` | Extracts skills, detects gaps, and computes ATS match score against a job description. |
| `nexa_generate_learning_roadmap` | Synthesizes a personalized, staged study roadmap based on identified candidate weaknesses. |
| `nexa_get_system_health` | Returns real-time health telemetry across the simulation engine, Gemini API, and database. |
| `nexa_export_interview_report` | Generates a candidate evaluation dossier in Markdown or JSON format. |

---

## 3. Example Tool Call: `nexa_start_mock_interview`

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "nexa_start_mock_interview",
    "arguments": {
      "role": "Backend",
      "seniority": "Senior",
      "focusArea": "Distributed Caching"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"sessionId\": \"nexa_1792948200_a81f9\",\n  \"track\": \"Backend\",\n  \"openingQuestion\": \"How would you prevent cache stampede in a high-traffic microservices cluster, and what are the trade-offs between distributed mutex locking and probabilistic early expiration (XFetch)?\"\n}"
      }
    ]
  }
}
```

---

## 4. Testing
Run the verification test script:

```bash
node mcp/test-mcp.js
```
