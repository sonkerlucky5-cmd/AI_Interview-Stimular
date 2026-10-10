const { pool } = require("../config/db");

const fullSchemaSql = `
  -- 1. Users (existing table preserved)
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'candidate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users (LOWER(email));
  CREATE INDEX IF NOT EXISTS idx_users_role ON users (role);

  -- 2. Resumes
  CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'uploaded',
    parsed_text TEXT,
    extracted_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS idx_resumes_user_created ON resumes (user_id, created_at DESC);

  -- 3. Job Descriptions
  CREATE TABLE IF NOT EXISTS job_descriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    description TEXT NOT NULL,
    requirements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_created ON job_descriptions (user_id, created_at DESC);

  -- 4. Resume Matches
  CREATE TABLE IF NOT EXISTS resume_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    job_description_id UUID NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    match_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    scoring_version VARCHAR(50) NOT NULL DEFAULT 'v1',
    model_version VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_resume_matches_user_created ON resume_matches (user_id, created_at DESC);

  -- 5. Interviews
  CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES resumes(id) ON DELETE SET NULL,
    job_description_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
    interview_type VARCHAR(50) NOT NULL DEFAULT 'technical',
    target_role VARCHAR(100) NOT NULL,
    language VARCHAR(50) NOT NULL DEFAULT 'English',
    difficulty VARCHAR(50) NOT NULL DEFAULT 'intermediate',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    question_limit INT NOT NULL DEFAULT 5,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_interviews_user_created ON interviews (user_id, created_at DESC);

  -- 6. Interview Questions
  CREATE TABLE IF NOT EXISTS interview_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    position INT NOT NULL,
    question_text TEXT NOT NULL,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_interview_question_pos UNIQUE (interview_id, position)
  );
  CREATE INDEX IF NOT EXISTS idx_interview_questions_lookup ON interview_questions (interview_id, position);

  -- 7. Interview Answers
  CREATE TABLE IF NOT EXISTS interview_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
    answer_text TEXT NOT NULL,
    transcript TEXT,
    idempotency_key VARCHAR(255),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_answer_question UNIQUE (question_id)
  );
  CREATE INDEX IF NOT EXISTS idx_interview_answers_question ON interview_answers (question_id);

  -- 8. Answer Evaluations
  CREATE TABLE IF NOT EXISTS answer_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    answer_id UUID NOT NULL REFERENCES interview_answers(id) ON DELETE CASCADE,
    scores JSONB NOT NULL DEFAULT '{}'::jsonb,
    strengths JSONB DEFAULT '[]'::jsonb,
    improvements JSONB DEFAULT '[]'::jsonb,
    ideal_answer TEXT,
    follow_up_suggestion TEXT,
    rubric_version VARCHAR(50) NOT NULL DEFAULT 'v1',
    model_version VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_evaluation_answer UNIQUE (answer_id)
  );

  -- 9. Curated Coding Questions
  CREATE TABLE IF NOT EXISTS coding_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    statement TEXT NOT NULL,
    difficulty VARCHAR(50) NOT NULL DEFAULT 'Medium',
    topics JSONB DEFAULT '[]'::jsonb,
    constraints JSONB DEFAULT '[]'::jsonb,
    examples JSONB DEFAULT '[]'::jsonb,
    starter_code JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_coding_questions_slug ON coding_questions (slug);

  -- 10. Coding Submissions (Execution safely disabled)
  CREATE TABLE IF NOT EXISTS coding_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID REFERENCES interviews(id) ON DELETE SET NULL,
    question_id UUID NOT NULL REFERENCES coding_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    language VARCHAR(50) NOT NULL,
    source_code TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    runner_reference VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS idx_coding_submissions_user ON coding_submissions (user_id, created_at DESC);

  -- 11. Coding Test Results
  CREATE TABLE IF NOT EXISTS coding_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES coding_submissions(id) ON DELETE CASCADE,
    passed_count INT NOT NULL DEFAULT 0,
    total_count INT NOT NULL DEFAULT 0,
    execution_ms INT,
    memory_kb INT,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  -- 12. Learning Plans
  CREATE TABLE IF NOT EXISTS learning_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source_interview_id UUID REFERENCES interviews(id) ON DELETE SET NULL,
    target_role VARCHAR(100) NOT NULL,
    available_minutes_per_day INT NOT NULL DEFAULT 45,
    start_date DATE DEFAULT CURRENT_DATE,
    target_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_learning_plans_user ON learning_plans (user_id, created_at DESC);

  -- 13. Learning Plan Items
  CREATE TABLE IF NOT EXISTS learning_plan_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES learning_plans(id) ON DELETE CASCADE,
    position INT NOT NULL,
    topic VARCHAR(255) NOT NULL,
    task TEXT NOT NULL,
    estimated_minutes INT NOT NULL DEFAULT 30,
    target_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    completed_at TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS idx_learning_plan_items_plan_pos ON learning_plan_items (plan_id, position);

  -- 14. Interview Reports
  CREATE TABLE IF NOT EXISTS interview_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interview_id UUID NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'ready',
    storage_key VARCHAR(500),
    summary JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generated_at TIMESTAMPTZ
  );
  CREATE INDEX IF NOT EXISTS idx_interview_reports_user ON interview_reports (user_id, created_at DESC);

  -- 15. AI Usage Events (Telemetry)
  CREATE TABLE IF NOT EXISTS ai_usage_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    feature VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'google',
    model VARCHAR(100) NOT NULL,
    input_tokens INT DEFAULT 0,
    output_tokens INT DEFAULT 0,
    estimated_cost NUMERIC(10, 6) DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'success',
    request_id VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX IF NOT EXISTS idx_ai_usage_events_user ON ai_usage_events (user_id, created_at DESC);
`;

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log("Starting PostgreSQL schema migration...");
    await client.query("BEGIN");
    await client.query(fullSchemaSql);
    await client.query("COMMIT");
    console.log("PostgreSQL schema migration completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { runMigrations, fullSchemaSql };

