-- Apply manually with the project's approved migration process. Never run against production without review.
BEGIN;

ALTER TABLE coding_questions
  ADD COLUMN IF NOT EXISTS test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS time_limit_ms INT NOT NULL DEFAULT 2000,
  ADD COLUMN IF NOT EXISTS memory_limit_kb INT NOT NULL DEFAULT 131072;

ALTER TABLE coding_test_results
  ADD COLUMN IF NOT EXISTS verdict VARCHAR(50),
  ADD COLUMN IF NOT EXISTS test_results JSONB NOT NULL DEFAULT '[]'::jsonb;

-- Small, real catalogue with stdin/stdout contracts compatible with Judge0.
INSERT INTO coding_questions
  (slug, title, statement, difficulty, topics, constraints, examples, starter_code, test_cases, is_active)
VALUES
  (
    'two-sum', 'Two Sum',
    'Read n, then n integers, then target from standard input. Print the two zero-based indices whose values sum to target, in ascending index order. Exactly one answer exists.',
    'Easy', $json$["Arrays", "Hash Map"]$json$::jsonb,
    $json$["2 <= n <= 100000", "Each input value and target fits a signed 32-bit integer"]$json$::jsonb,
    $json$[{"input":"4\n2 7 11 15\n9\n","output":"0 1\n"}]$json$::jsonb,
    $json${"javascript":"const fs = require(\"fs\");\nconst data = fs.readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number);\nconst n = data[0], nums = data.slice(1, n + 1), target = data[n + 1];\nconst seen = new Map();\nfor (let i = 0; i < n; i++) { const need = target - nums[i]; if (seen.has(need)) { console.log(seen.get(need), i); process.exit(0); } seen.set(nums[i], i); }\n", "python":"import sys\ndata = list(map(int, sys.stdin.read().split()))\nn = data[0]\nnums = data[1:n+1]\ntarget = data[n+1]\nseen = {}\nfor i, value in enumerate(nums):\n    if target - value in seen:\n        print(seen[target - value], i)\n        break\n    seen[value] = i\n"}$json$::jsonb,
    $json$[{"input":"4\n2 7 11 15\n9\n","expected_output":"0 1\n"},{"input":"3\n3 2 4\n6\n","expected_output":"1 2\n"},{"input":"2\n3 3\n6\n","expected_output":"0 1\n"}]$json$::jsonb,
    true
  ),
  (
    'valid-parentheses', 'Valid Parentheses',
    'Read one line containing only (), {}, and []. Print true if every opening bracket is closed by the same type in the correct order; otherwise print false.',
    'Easy', $json$["Stack", "Strings"]$json$::jsonb,
    $json$["0 <= input length <= 100000"]$json$::jsonb,
    $json$[{"input":"()[]{}\n","output":"true\n"}]$json$::jsonb,
    $json${"javascript":"const fs = require(\"fs\");\nconst s = fs.readFileSync(0, \"utf8\").trim();\nconst pairs = {\")\":\"(\", \"]\":\"[\", \"}\":\"{\"}; const stack = [];\nfor (const ch of s) { if (\"([{\".includes(ch)) stack.push(ch); else if (stack.pop() !== pairs[ch]) { console.log(false); process.exit(0); } }\nconsole.log(stack.length === 0);\n", "python":"import sys\ns = sys.stdin.readline().strip()\npairs = {')': '(', ']': '[', '}': '{'}\nstack = []\nfor ch in s:\n    if ch in '([{': stack.append(ch)\n    elif not stack or stack.pop() != pairs[ch]:\n        print('false')\n        raise SystemExit\nprint('true' if not stack else 'false')\n"}$json$::jsonb,
    $json$[{"input":"()[]{}\n","expected_output":"true\n"},{"input":"(]\n","expected_output":"false\n"},{"input":"([)]\n","expected_output":"false\n"}]$json$::jsonb,
    true
  ),
  (
    'maximum-subarray', 'Maximum Subarray',
    'Read n followed by n integers. Print the largest possible sum of a non-empty contiguous subarray.',
    'Medium', $json$["Arrays", "Dynamic Programming"]$json$::jsonb,
    $json$["1 <= n <= 100000", "-10000 <= each value <= 10000"]$json$::jsonb,
    $json$[{"input":"9\n-2 1 -3 4 -1 2 1 -5 4\n","output":"6\n"}]$json$::jsonb,
    $json${"javascript":"const fs = require(\"fs\");\nconst a = fs.readFileSync(0, \"utf8\").trim().split(/\\s+/).map(Number).slice(1);\nlet best = a[0], current = a[0];\nfor (const x of a.slice(1)) { current = Math.max(x, current + x); best = Math.max(best, current); }\nconsole.log(best);\n", "python":"import sys\na = list(map(int, sys.stdin.read().split()))[1:]\ncurrent = best = a[0]\nfor x in a[1:]:\n    current = max(x, current + x)\n    best = max(best, current)\nprint(best)\n"}$json$::jsonb,
    $json$[{"input":"9\n-2 1 -3 4 -1 2 1 -5 4\n","expected_output":"6\n"},{"input":"1\n5\n","expected_output":"5\n"},{"input":"5\n-5 -2 -8 -1 -4\n","expected_output":"-1\n"}]$json$::jsonb,
    true
  )
ON CONFLICT (slug) DO NOTHING;

COMMIT;
