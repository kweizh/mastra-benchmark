import * as fs from "fs";
import * as path from "path";
import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

const ATTEMPTS_FILE = path.join("/home/user/project", "attempts.txt");

// Step: reads attempt count, increments, writes back, throws if < 3
const unstableStep = createStep({
  id: "unstableStep",
  inputSchema: z.object({}),
  outputSchema: z.object({ status: z.string() }),
  async execute() {
    // Read current attempt count
    let count = 0;
    try {
      const raw = fs.readFileSync(ATTEMPTS_FILE, "utf8").trim();
      count = raw ? parseInt(raw, 10) : 0;
      if (isNaN(count)) count = 0;
    } catch {
      count = 0;
    }

    // Increment and write back
    count += 1;
    fs.writeFileSync(ATTEMPTS_FILE, String(count), "utf8");

    console.log(`unstableStep: attempt #${count}`);

    if (count < 3) {
      throw new Error(`Not ready yet (attempt ${count})`);
    }

    return { status: "success" };
  },
});

// Workflow: executes unstableStep with retry config
const retryWorkflow = createWorkflow({
  id: "retryWorkflow",
  inputSchema: z.object({}),
  outputSchema: z.object({ status: z.string() }),
  retryConfig: { attempts: 5, delay: 100 },
})
  .then(unstableStep)
  .commit();

async function main() {
  // 1. Reset attempts counter
  fs.writeFileSync(ATTEMPTS_FILE, "0", "utf8");
  console.log("Reset attempts.txt to 0");

  // 2. Execute the workflow
  const run = await retryWorkflow.createRun();
  const result = await run.start({ inputData: {} });

  console.log("Workflow result:", JSON.stringify(result, null, 2));

  // 3. Write result to result.json
  const resultPath = path.join("/home/user/project", "result.json");
  fs.writeFileSync(resultPath, JSON.stringify(result, null, 2), "utf8");
  console.log(`Result written to ${resultPath}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
