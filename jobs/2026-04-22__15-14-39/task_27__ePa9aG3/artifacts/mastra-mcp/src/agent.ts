import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { mcp } from "./mcp";

export async function createAgent() {
  return new Agent({
    id: "filesystem-agent",
    name: "Filesystem Agent",
    instructions:
      "You can use filesystem tools to read and write files in /home/user/data.",
    model: openai("gpt-4o-mini"),
    tools: await mcp.listTools(),
  });
}
