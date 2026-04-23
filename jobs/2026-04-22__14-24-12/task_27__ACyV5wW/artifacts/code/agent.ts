import { Agent } from "@mastra/core/agent";
import { openai } from "@ai-sdk/openai";
import { mcp } from "./mcp";

export async function createAgent(): Promise<Agent> {
  const tools = await mcp.listTools();

  return new Agent({
    name: "filesystem-agent",
    instructions:
      "You are a helpful assistant with access to the local filesystem. Use the available tools to read and write files as requested.",
    model: openai("gpt-4o-mini"),
    tools,
  });
}
