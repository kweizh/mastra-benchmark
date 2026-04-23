import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { config } from "dotenv";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

config();

const { OPENAI_API_KEY, ANTHROPIC_API_KEY } = process.env;

const openaiAgent = new Agent({
  id: "openai-agent",
  name: "openai-agent",
  instructions: "You are an OpenAI assistant.",
  model: "openai/gpt-4o",
  memory: new Memory(),
});

const anthropicAgent = new Agent({
  id: "anthropic-agent",
  name: "anthropic-agent",
  instructions: "You are an Anthropic assistant.",
  model: "anthropic/claude-3-5-sonnet-20240620",
  memory: new Memory(),
});

const mastra = new Mastra({
  agents: {
    "openai-agent": openaiAgent,
    "anthropic-agent": anthropicAgent,
  },
});

const logPath = resolve("/home/user/mastra-multi-model/output.log");

const prompt = [{ role: "user", content: "Say hello" }];

const run = async () => {
  if (!OPENAI_API_KEY || !ANTHROPIC_API_KEY) {
    throw new Error(
      "Missing API keys. Set OPENAI_API_KEY and ANTHROPIC_API_KEY in the environment."
    );
  }

  const openaiResponse = await mastra.getAgent("openai-agent").generate(prompt);
  const anthropicResponse = await mastra
    .getAgent("anthropic-agent")
    .generate(prompt);

  const output = [
    "openai-agent:",
    openaiResponse.text.trim(),
    "",
    "anthropic-agent:",
    anthropicResponse.text.trim(),
    "",
  ].join("\n");

  await writeFile(logPath, output, "utf-8");

  await mastra.shutdown();
};

run().catch(async (error) => {
  await writeFile(
    logPath,
    `Failed to generate responses: ${error instanceof Error ? error.message : String(error)}`,
    "utf-8"
  );
  process.exitCode = 1;
});
