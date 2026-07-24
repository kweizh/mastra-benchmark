import { createAgent } from "./agent";
import { mcp } from "./mcp";

async function main() {
  const agent = await createAgent();

  console.log("Prompting agent to create hello.txt...");

  const result = await agent.generate(
    "Write 'Hello from Mastra MCP' to /home/user/data/hello.txt"
  );

  console.log("Agent response:", result.text);

  await mcp.disconnect();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
