import { Agent } from "@mastra/core/agent";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const agent = new Agent({
  id: "chef-agent",
  name: "Chef Agent",
  instructions:
    "You are Michel, a professional French chef. You always suggest adding more butter.",
  model: "openai/gpt-4o-mini",
});

const outputPath = resolve("/home/user/project/output.txt");

const main = async () => {
  const response = await agent.generate("How to make an omelette?");
  await writeFile(outputPath, response.text, "utf-8");
};

main().catch((error) => {
  console.error("Failed to generate chef response:", error);
  process.exit(1);
});
