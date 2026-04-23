import { Agent } from "@mastra/core/agent";
import { createVectorQueryTool } from "@mastra/rag";
import { openai } from "@ai-sdk/openai";

export const researchAgent = new Agent({
  id: "research-agent",
  name: "Research Assistant",
  instructions:
    "You are a research assistant. Use the vector query tool to ground answers in the indexed paper.",
  model: "openai/gpt-4o-mini",
  tools: {
    paperSearch: createVectorQueryTool({
      vectorStoreName: "libSqlVector",
      indexName: "papers",
      model: openai.embedding("text-embedding-3-small"),
    }),
  },
});
