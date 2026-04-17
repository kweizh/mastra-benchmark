# Mastra Human-in-the-Loop Workflow

## Background
Mastra workflows can be paused at any step to wait for external input or approval (Human-in-the-loop). When a workflow is suspended, its current execution state is saved. You can later resume the workflow run, providing the required `resumeData`.

## Requirements
Create a Node.js project using Mastra that implements a Human-in-the-loop workflow.

1. Initialize a Node.js project in `/home/user/mastra-app`.
2. Install `@mastra/core`, `zod`, `typescript`, `tsx`, and `@types/node`.
3. Create `workflow.ts` that defines and exports a workflow named `contentApprovalWorkflow`:
   - Input schema: `{ content: z.string() }`
   - Output schema: `{ result: z.string() }`
   - It should have a step `reviewStep` that suspends execution if `resumeData` is not provided. To suspend, use `await suspend()`.
   - `resumeSchema` should be `{ approved: z.boolean() }`.
   - If resumed and `resumeData.approved` is true, the step output `result` should be `"Publish: " + content`.
   - If `resumeData.approved` is false, `result` should be `"Discard: " + content`.
   - The workflow output should match the step's output.
4. Create `run.ts` that:
   - Initializes a Mastra instance with `contentApprovalWorkflow`.
   - Starts a run with input `{ content: "Hello World" }`.
   - Checks if the run status is `"suspended"`.
   - Resumes the run with `resumeData: { approved: true }`.
   - Writes the final workflow result object (e.g., `{"result": "Publish: Hello World"}`) to `/home/user/mastra-app/output.json`.

## Constraints
- Project path: `/home/user/mastra-app`
- Output file: `/home/user/mastra-app/output.json`
- Start command: `npx tsx run.ts`