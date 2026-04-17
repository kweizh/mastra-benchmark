# Multi-Model Mastra Agents

## Background
Mastra allows creating agents that use different LLM providers via the Vercel AI SDK. This task requires setting up a Mastra instance with two agents, one using OpenAI and the other using Anthropic.

## Requirements
- Initialize a Node.js project and install Mastra dependencies.
- Create a Mastra instance with two agents:
  1. `openai-agent` using `openai/gpt-4o` with instructions "You are an OpenAI assistant."
  2. `anthropic-agent` using `anthropic/claude-3-5-sonnet-20240620` with instructions "You are an Anthropic assistant."
- Write a script to instantiate the Mastra instance, prompt both agents with "Say hello", and save their responses to a log file.

## Implementation Guide
1. Create a project directory at `/home/user/mastra-multi-model` and initialize it with `npm init -y`.
2. Install required dependencies: `npm install @mastra/core @mastra/memory zod dotenv`.
3. Create `index.ts` (or `.js`) that configures a `Mastra` instance with the two agents.
4. Ensure the script reads `OPENAI_API_KEY` and `ANTHROPIC_API_KEY` from the environment.
5. The script should call `generate('Say hello')` on both agents.
6. Write the output of both agents to `/home/user/mastra-multi-model/output.log`.

## Constraints
- Project path: `/home/user/mastra-multi-model`
- Log file: `/home/user/mastra-multi-model/output.log`
- You must use `@mastra/core` and `@mastra/core/agent` to define the agents.
- You can run the script via `npx tsx index.ts` or similar.

## Integrations
- OpenAI
- Anthropic