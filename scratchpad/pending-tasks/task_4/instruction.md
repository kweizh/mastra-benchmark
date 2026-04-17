# Mastra Conditional Workflow

## Background
You need to build a content moderation workflow using Mastra's `.branch()` control flow. The workflow will score content based on its length and route it to different steps depending on the score.

## Requirements
- Create a workflow that accepts `{ content: string }`.
- **Step 1 (`score-step`)**: Calculate the length of the `content` and return `{ score: number }`.
- **Branching**:
  - If `score > 20`, route to **`approve-step`**, which receives the score and returns `{ status: "approved", finalScore: score }`.
  - If `score <= 20`, route to **`reject-step`**, which receives the score and returns `{ status: "rejected", finalScore: score }`.
- **Step 3 (`final-step`)**: Receive the branch output and return `{ message: string }` formatted as `"Content was [status] with score [finalScore]"`.
- Run the workflow with the input `content: "This is a very long piece of content that should be approved"` and write the JSON result to a file.

## Implementation Guide
1. Initialize a Node.js project in `/home/user/app`.
2. Install `@mastra/core` and `zod`.
3. Create `/home/user/app/workflow.ts` and define the steps and workflow using `createStep` and `createWorkflow`. Export the workflow as `contentWorkflow`.
4. Create `/home/user/app/index.ts` to execute the workflow with the specified input.
5. Write the `result` object from the workflow run to `/home/user/app/output.json`.

## Constraints
- Project path: `/home/user/app`
- Log file: `/home/user/app/output.json`
- Must use `@mastra/core/workflows` for the implementation.

## Integrations
- None