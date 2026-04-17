# Mastra Workflow Error Handling and Retries

## Background
Mastra workflows support error handling and retries for transient failures. In this task, you will create a workflow that retries a failing step and handles the final result.

## Requirements
- Initialize a Node.js project with TypeScript.
- Install `@mastra/core`, `zod`, `typescript`, `tsx`, and `@types/node`.
- Create a step `unstableStep` that reads a number from `/home/user/project/attempts.txt` (defaulting to 0 if the file is empty or missing), increments it, and writes it back. If the number is less than 3, it throws an error. If it is 3 or greater, it returns `{ status: "success" }`.
- Create a workflow `retryWorkflow` that executes `unstableStep`. Configure the workflow with `retryConfig: { attempts: 5, delay: 100 }` so it retries the step upon failure.
- Create an `index.ts` script that:
  1. Writes `0` to `/home/user/project/attempts.txt`.
  2. Executes the workflow.
  3. Writes the stringified workflow result to `/home/user/project/result.json`.

## Implementation Guide
1. Initialize project in `/home/user/project` and install dependencies.
2. Create `index.ts` with the step and workflow definitions.
3. Use `fs` to read/write `attempts.txt`.
4. Run the workflow using `const run = await retryWorkflow.createRun(); await run.start();`.

## Constraints
- Project path: `/home/user/project`
- Log file: `/home/user/project/result.json`
- Use `@mastra/core` version `0.1.34` or latest.