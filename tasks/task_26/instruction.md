# Configure a Supervisor Agent to Coordinate Sub-Agents in Mastra

## Background
Mastra is a TypeScript AI agent framework. You need to configure a Supervisor agent that coordinates two sub-agents: a 'Coder' and a 'Reviewer', using shared memory.

## Requirements
- You have an empty directory at `/home/user/project`.
- Initialize a Node.js project in `/home/user/project`.
- Install `@mastra/core`, `@mastra/memory`, and `zod`.
- Create a `src/index.ts` file that exports a `Mastra` instance.
- Create three agents: `coder`, `reviewer`, and `supervisor`.
- The `coder` agent should be configured with instructions to write TypeScript code.
- The `reviewer` agent should be configured with instructions to review TypeScript code for security and performance.
- The `supervisor` agent should have instructions to coordinate the `coder` and `reviewer` to complete a user request.
- All three agents must share the same `Memory` instance to retain conversational context.
- The `Mastra` instance must register all three agents.
- Create a script `src/run.ts` that initializes the system, sends a request to the supervisor agent to "Write a simple Express server and review it", and writes the final output to `/home/user/project/output.txt`.

## Constraints
- Project path: `/home/user/project`
- Log file: `/home/user/project/output.txt`
- The models used should be `openai/gpt-4o-mini` (or similar, assuming `OPENAI_API_KEY` is provided).
- Use `tsx` or `ts-node` to run the TypeScript file.