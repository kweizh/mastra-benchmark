import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { contentApprovalWorkflow } from "./workflow";
import * as fs from "fs";
import * as path from "path";

const mastra = new Mastra({
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: ":memory:",
  }),
  workflows: { contentApprovalWorkflow },
});

async function main() {
  const workflow = mastra.getWorkflow("contentApprovalWorkflow");
  const run = await workflow.createRun();

  // Start the run with initial input
  const startResult = await run.start({
    inputData: { content: "Hello World" },
  });

  console.log("Start status:", startResult.status);

  if (startResult.status !== "suspended") {
    throw new Error(
      `Expected workflow to be suspended, but got: ${startResult.status}`
    );
  }

  console.log("Workflow suspended, resuming with approved: true");

  // Resume the suspended workflow with approval
  const resumeResult = await run.resume({
    step: "reviewStep",
    resumeData: { approved: true },
  });

  console.log("Resume status:", resumeResult.status);

  if (resumeResult.status !== "success") {
    throw new Error(
      `Expected workflow to succeed, but got: ${resumeResult.status}`
    );
  }

  const output = resumeResult.result;
  console.log("Workflow result:", output);

  // Write the final result to output.json
  const outputPath = path.join(__dirname, "output.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`Output written to ${outputPath}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
