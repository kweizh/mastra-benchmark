import { createAgent } from "./agent";

async function main() {
  const agent = await createAgent();
  const result = await agent.generate(
    "Write 'Hello from Mastra MCP' to /home/user/data/hello.txt"
  );

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
