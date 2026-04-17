# Mastra Calculator Tool

## Background
Mastra is a TypeScript AI agent framework. You need to create a custom tool and attach it to an agent to solve multi-step math problems.

## Requirements
- You have a Node.js project directory at `/home/user/project`.
- Install `@mastra/core` and `zod`.
- Create a file `agent.ts` that exports:
  1. `calculatorTool`: A tool created with `createTool` (from `@mastra/core` or `@mastra/core/tools` if applicable). Its `id` should be `'calculator'`. Its `inputSchema` should be a Zod object with `a` (number) and `b` (number). Its `execute` function should return `{ sum: a + b }`.
  2. `mathAgent`: An `Agent` (from `@mastra/core/agent`) with `id` `'math-agent'`, model `'openai/gpt-4o'`, instructions `'You are a math assistant.'`, and `tools: { calculatorTool }`.

## Implementation Guide
1. `cd /home/user/project`
2. `npm init -y`
3. `npm install @mastra/core zod typescript @types/node tsx`
4. Create `agent.ts` with the required exports.

## Constraints
- Project path: /home/user/project

## Integrations
- None