import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";

const sharedMemory = new Memory();

const coder = new Agent({
  id: "coder",
  name: "Coder",
  instructions:
    "You are a senior TypeScript engineer. Write clean, idiomatic TypeScript code with clear structure and comments when useful.",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
});

const reviewer = new Agent({
  id: "reviewer",
  name: "Reviewer",
  instructions:
    "You are a security- and performance-focused TypeScript reviewer. Identify potential vulnerabilities, inefficiencies, and provide concrete improvements.",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
});

const supervisor = new Agent({
  id: "supervisor",
  name: "Supervisor",
  instructions:
    "Coordinate the Coder and Reviewer agents to complete user requests. Delegate coding tasks to Coder, ask Reviewer to evaluate the result for security and performance, then merge findings into a final response.",
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
  agents: {
    coder,
    reviewer,
  },
});

export const mastra = new Mastra({
  agents: {
    coder,
    reviewer,
    supervisor,
  },
  memory: {
    shared: sharedMemory,
  },
});
