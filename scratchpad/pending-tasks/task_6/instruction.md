# Mastra Supervisor Agent with Shared Memory

## Background
You are building a multi-agent system using Mastra. You need to configure a Supervisor agent to coordinate two sub-agents (a "Coder" and a "Reviewer") with shared memory. The supervisor will handle delegation decisions and context passing.

## Requirements
- Initialize a Node.js project in `/home/user/app`.
- Install `@mastra/core`, `@mastra/memory`, `@mastra/libsql`, and `zod`.
- Create a file `src/supervisor.ts` that exports a `supervisor` agent.
- Create a `coderAgent` with the ID `coder-agent`, using the `openai/gpt-4o-mini` model, and description `Writes code based on requirements.`.
- Create a `reviewerAgent` with the ID `reviewer-agent`, using the `openai/gpt-4o-mini` model, and description `Reviews code for correctness and style.`.
- Create a `supervisor` agent with the ID `supervisor`, using the `openai/gpt-4o-mini` model. Its instructions should tell it to coordinate the coder and reviewer. It must include both agents in its `agents` property.
- All three agents must share the same `Memory` instance backed by a `LibSQLStore` at `file:mastra.db`.
- Write an execution script `src/run.ts` that imports the `supervisor` and calls `await supervisor.generate("Write a hello world function in Python, then review it.", { memory: { resource: "user-1", thread: "task-1" } })`. It should write the final text response to `/home/user/app/output.log`.

## Implementation Guide
1. `cd /home/user/app` and initialize a Node.js project.
2. Install the required Mastra packages.
3. Implement `src/supervisor.ts` with the agents and memory store.
4. Implement `src/run.ts` to execute the supervisor agent and write the result to `output.log`.
5. Run the script using `npx tsx src/run.ts`.

## Constraints
- Project path: `/home/user/app`
- Log file: `/home/user/app/output.log`
- Database file: `/home/user/app/mastra.db`

## Integrations
- OpenAI