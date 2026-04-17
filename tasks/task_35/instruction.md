# Create a Weather Tool with Mastra

## Background
Mastra is a TypeScript AI agent framework. Tools are reusable functions that agents can call to interact with external systems or perform specific tasks. In this task, you will create a custom Mastra tool that fetches weather data.

## Requirements
- Initialize a Node.js project in `/home/user/project`.
- Install `@mastra/core` and `zod`.
- Create a file `index.ts` that exports a Mastra tool named `weatherTool`.
- The tool must be created using `createTool` from `@mastra/core/tools`.
- The tool's `id` must be `weather-tool`.
- The `inputSchema` must use `zod` to require a `location` string.
- The `execute` function must be an async function that takes an object containing `inputData` (which has `location`) and returns an object with a `weather` property containing the string `The weather in {location} is sunny.`.

## Implementation Guide
1. Run `mkdir -p /home/user/project` and `cd /home/user/project`.
2. Run `npm init -y`.
3. Run `npm install @mastra/core zod typescript @types/node tsx`.
4. Create `index.ts` and define the tool:
   ```typescript
   import { createTool } from '@mastra/core/tools';
   import { z } from 'zod';

   export const weatherTool = createTool({
     id: 'weather-tool',
     description: 'Get the weather for a location',
     inputSchema: z.object({
       location: z.string()
     }),
     execute: async ({ inputData }) => {
       return { weather: `The weather in ${inputData.location} is sunny.` };
     }
   });
   ```

## Constraints
- Project path: `/home/user/project`
- The file must be named `index.ts`.
- The exported tool must be named `weatherTool`.