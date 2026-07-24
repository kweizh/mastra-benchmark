import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { createTool } from "@mastra/core/tools";
import { InMemoryStore } from "@mastra/core/storage";
import { Memory } from "@mastra/memory";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Shared storage and memory
// All three agents share the same Memory instance so conversation context is
// retained across agents within the same thread.
// ---------------------------------------------------------------------------
export const storage = new InMemoryStore();

export const sharedMemory = new Memory({
  storage,
  options: {
    lastMessages: 20,
    semanticRecall: false,
  },
});

// ---------------------------------------------------------------------------
// Coder agent
// Responsible for writing TypeScript code based on requirements.
// ---------------------------------------------------------------------------
export const coder = new Agent({
  id: "coder",
  name: "Coder",
  instructions: `You are an expert TypeScript developer.
Your sole responsibility is to write clean, well-typed TypeScript code.
When asked to implement something you:
1. Write the full TypeScript source code.
2. Add brief inline comments explaining non-obvious parts.
3. Return ONLY the code block – no prose before or after.`,
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
});

// ---------------------------------------------------------------------------
// Reviewer agent
// Responsible for reviewing TypeScript code for security and performance.
// ---------------------------------------------------------------------------
export const reviewer = new Agent({
  id: "reviewer",
  name: "Reviewer",
  instructions: `You are a senior TypeScript code reviewer specialising in security and performance.
When given TypeScript code you:
1. Identify any security vulnerabilities (e.g. injection, prototype pollution, unsafe deserialization).
2. Identify performance bottlenecks or inefficient patterns.
3. Suggest concrete, actionable improvements.
4. Return your review as a structured report with sections: **Security**, **Performance**, and **Recommendations**.`,
  model: "openai/gpt-4o-mini",
  memory: sharedMemory,
});

// ---------------------------------------------------------------------------
// Tools that the supervisor uses to delegate to sub-agents.
// execute(inputData, context) – inputData holds the validated input values.
// ---------------------------------------------------------------------------
const delegateToCoder = createTool({
  id: "delegate-to-coder",
  description:
    "Delegate a TypeScript coding task to the Coder agent. Returns the generated code.",
  inputSchema: z.object({
    task: z
      .string()
      .describe("A detailed description of the code to be written."),
    threadId: z.string().describe("Shared conversation thread ID."),
    resourceId: z.string().describe("Shared resource / user ID."),
  }),
  execute: async (inputData) => {
    const { task, threadId, resourceId } = inputData;
    const result = await coder.generate(task, {
      memory: { thread: threadId, resource: resourceId },
    });
    return { code: result.text };
  },
});

const delegateToReviewer = createTool({
  id: "delegate-to-reviewer",
  description:
    "Delegate a code review task to the Reviewer agent. Returns the review report.",
  inputSchema: z.object({
    code: z.string().describe("The TypeScript code to be reviewed."),
    threadId: z.string().describe("Shared conversation thread ID."),
    resourceId: z.string().describe("Shared resource / user ID."),
  }),
  execute: async (inputData) => {
    const { code, threadId, resourceId } = inputData;
    const prompt = `Please review the following TypeScript code:\n\n\`\`\`typescript\n${code}\n\`\`\``;
    const result = await reviewer.generate(prompt, {
      memory: { thread: threadId, resource: resourceId },
    });
    return { review: result.text };
  },
});

// ---------------------------------------------------------------------------
// Supervisor agent
// Orchestrates coder and reviewer to fulfil a user request end-to-end.
// ---------------------------------------------------------------------------
export const supervisor = new Agent({
  id: "supervisor",
  name: "Supervisor",
  instructions: `You are a software project supervisor.
You coordinate two specialist agents – a Coder and a Reviewer – to fulfil user requests.

Workflow:
1. Analyse the user's request and decide what needs to be built.
2. Use the 'delegate-to-coder' tool to ask the Coder agent to write the code.
   - Pass a threadId of "shared-thread" and resourceId of "user-demo" to both tools.
3. Once you have the code, use the 'delegate-to-reviewer' tool to ask the Reviewer agent to review it.
   - Pass the same threadId and resourceId so they share memory context.
4. Synthesise the code and the review into a final response that contains:
   - The complete TypeScript source code (in a fenced code block).
   - A summary of the review findings.
   - Any next steps or recommendations.`,
  model: "openai/gpt-4o-mini",
  tools: {
    delegateToCoder,
    delegateToReviewer,
  },
  memory: sharedMemory,
});

// ---------------------------------------------------------------------------
// Mastra instance – registers all three agents
// ---------------------------------------------------------------------------
export const mastra = new Mastra({
  agents: { coder, reviewer, supervisor },
  storage,
});
