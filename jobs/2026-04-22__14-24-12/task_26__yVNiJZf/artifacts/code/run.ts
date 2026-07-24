import fs from "fs/promises";
import path from "path";
import { mastra } from "./index.js";

const OUTPUT_FILE = path.resolve(process.cwd(), "output.txt");
const USER_REQUEST = "Write a simple Express server and review it";

// Stable IDs so memory is shared across both sub-agent calls
const RESOURCE_ID = "user-demo";
const THREAD_ID = "shared-thread";

async function main(): Promise<void> {
  console.log("=== Mastra Supervisor Demo ===\n");
  console.log(`Request: "${USER_REQUEST}"\n`);

  const supervisorAgent = mastra.getAgent("supervisor");

  console.log("Sending request to supervisor agent …\n");

  const result = await supervisorAgent.generate(USER_REQUEST, {
    memory: { thread: THREAD_ID, resource: RESOURCE_ID },
  });

  const output = result.text;

  console.log("--- Supervisor Response ---\n");
  console.log(output);
  console.log("\n--- End of Response ---\n");

  await fs.writeFile(OUTPUT_FILE, output, "utf-8");
  console.log(`Output written to: ${OUTPUT_FILE}`);
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
