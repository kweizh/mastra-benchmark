# Mastra Conditional Workflow

## Background
Mastra is a TypeScript AI agent framework. Workflows let you define complex sequences of tasks using clear, structured steps. You need to implement a workflow that routes customer support tickets based on a sentiment score using `.branch()`.

## Requirements
- Create a Mastra workflow that takes a `sentimentScore` (number) as input.
- The workflow must branch into two paths based on the score:
  - If `sentimentScore < 5`, it should execute an `escalateStep` that outputs `status: 'Escalated to human agent' `.
  - If `sentimentScore >= 5`, it should execute an `autoReplyStep` that outputs `status: 'Auto-reply sent' `.
- A final step must combine the result and return a single `result` string.
- Execute the workflow with a `sentimentScore` of 3 and save the final result to a JSON file.

## Implementation Guide
1. Initialize a Node.js project in `/home/user/mastra-project` and install `@mastra/core` and `zod`.
2. Create an `index.ts` file (and configure `tsconfig.json` to run it, or use `tsx` / `ts-node`).
3. Define the steps using `createStep` from `@mastra/core/workflows`:
   - `categorizeStep`: passes the `sentimentScore` forward.
   - `escalateStep`: returns `{ status: 'Escalated to human agent' }`.
   - `autoReplyStep`: returns `{ status: 'Auto-reply sent' }`.
   - `finalStep`: takes the output of the executed branch and returns `{ result: status }`.
4. Define the workflow using `createWorkflow` with `.then(categorizeStep).branch([...]).then(finalStep).commit()`.
5. Run the workflow with `sentimentScore: 3` and write the output of the workflow run to `/home/user/mastra-project/output.json`.

## Constraints
- Project path: `/home/user/mastra-project`
- Log file: `/home/user/mastra-project/output.json`
- Start command: `npx tsx index.ts`
- You must use `@mastra/core` version `0.4.1-alpha.33` or `latest`.

## Integrations
- None