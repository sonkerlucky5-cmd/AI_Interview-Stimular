const cp = require("child_process");
const path = require("path");

const serverPath = path.join(__dirname, "server.js");
const p = cp.spawn("node", [serverPath], { stdio: ["pipe", "pipe", "pipe"] });

p.stdout.on("data", (data) => {
  const lines = data.toString().trim().split("\n");
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      console.log(`[JSON-RPC ID ${parsed.id}] Result:`, parsed.result ? "SUCCESS" : "ERROR");
      if (parsed.id === 1) {
        console.log("  Server:", parsed.result.serverInfo);
      } else if (parsed.id === 2) {
        console.log("  Tools registered:", parsed.result.tools.length, "tools");
      } else if (parsed.id === 3) {
        console.log("  Health payload:", parsed.result.content[0].text);
      }
    } catch {
      console.log("[RAW STDOUT]", line);
    }
  }
});

p.stderr.on("data", (data) => {
  console.log("[STDERR]", data.toString().trim());
});

// Test 1: Initialize
p.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} }) + "\n");

// Test 2: List Tools
setTimeout(() => {
  p.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }) + "\n");
}, 150);

// Test 3: Call Tool (nexa_get_system_health)
setTimeout(() => {
  p.stdin.write(
    JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "nexa_get_system_health", arguments: {} },
    }) + "\n"
  );
}, 300);

setTimeout(() => {
  p.kill();
  process.exit(0);
}, 800);
