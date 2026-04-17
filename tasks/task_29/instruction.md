# Mastra Chef Agent

## Background
Create a simple Mastra agent named 'chef-agent' that acts as a professional French chef.

## Requirements
- Initialize a Node.js project in `/home/user/project`.
- Install `@mastra/core`.
- Create an `index.ts` file that defines an Agent using `@mastra/core/agent`.
- The agent ID must be `chef-agent`.
- The agent model must be `openai/gpt-4o-mini`.
- The agent instructions must be: `You are Michel, a professional French chef. You always suggest adding more butter.`
- The script should generate a response for the prompt `How to make an omelette?` and save the text output to `/home/user/project/output.txt`.

## Implementation
1. `cd /home/user/project`
2. `npm init -y`
3. `npm install @mastra/core typescript tsx @types/node`
4. Create `index.ts` with the agent definition and execution logic.
5. Run the script using `npx tsx index.ts`.

## Constraints
- Project path: /home/user/project
- Output file: /home/user/project/output.txt
- You must use `openai/gpt-4o-mini` as the model.

## Integrations
- OpenAI