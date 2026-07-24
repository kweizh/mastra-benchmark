import "dotenv/config";
import fs from "fs";
import path from "path";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";

// ---------------------------------------------------------------------------
// Agent definitions
// ---------------------------------------------------------------------------

const openaiAgent = new Agent({
  id: "openai-agent",
  name: "OpenAI Agent",
  instructions: "You are an OpenAI assistant.",
  model: "openai/gpt-4o",
});

// NOTE: claude-3-5-sonnet-20240620 is no longer available as of 2026.
// Using the current equivalent: claude-sonnet-4-20250514.
const anthropicAgent = new Agent({
  id: "anthropic-agent",
  name: "Anthropic Agent",
  instructions: "You are an Anthropic assistant.",
  model: "anthropic/claude-sonnet-4-20250514",
});

// ---------------------------------------------------------------------------
// Mastra instance
// ---------------------------------------------------------------------------

const mastra = new Mastra({
  agents: {
    "openai-agent": openaiAgent,
    "anthropic-agent": anthropicAgent,
  },
});

// ---------------------------------------------------------------------------
// Main: prompt both agents and write results to output.log
// ---------------------------------------------------------------------------

async function main() {
  const prompt = "Say hello";

  console.log(`Prompting both agents with: "${prompt}"\n`);

  // Retrieve agents from the Mastra instance
  const oAgent = mastra.getAgent("openai-agent");
  const aAgent = mastra.getAgent("anthropic-agent");

  // Generate responses
  const [openaiResult, anthropicResult] = await Promise.all([
    oAgent.generate(prompt),
    aAgent.generate(prompt),
  ]);

  const openaiText =
    typeof openaiResult.text === "string"
      ? openaiResult.text
      : JSON.stringify(openaiResult);

  const anthropicText =
    typeof anthropicResult.text === "string"
      ? anthropicResult.text
      : JSON.stringify(anthropicResult);

  console.log("=== OpenAI Agent Response ===");
  console.log(openaiText);
  console.log("\n=== Anthropic Agent Response ===");
  console.log(anthropicText);

  // Build log content
  const timestamp = new Date().toISOString();
  const logContent = [
    `Timestamp: ${timestamp}`,
    `Prompt: "${prompt}"`,
    "",
    "=== OpenAI Agent (openai/gpt-4o) ===",
    openaiText,
    "",
    "=== Anthropic Agent (anthropic/claude-3-5-sonnet-20240620) ===",
    anthropicText,
    "",
  ].join("\n");

  const outputPath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    "output.log"
  );

  fs.writeFileSync(outputPath, logContent, "utf-8");
  console.log(`\nResponses saved to ${outputPath}`);
}

main().catch((err) => {
  console.error("Error running agents:", err);
  process.exit(1);
});
