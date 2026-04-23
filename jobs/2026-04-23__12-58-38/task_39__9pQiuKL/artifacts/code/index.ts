import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

const ATTEMPTS_FILE = '/home/user/project/attempts.txt';
const RESULT_FILE = '/home/user/project/result.json';

// Create the unstableStep
const unstableStep = createStep({
  id: 'unstable-step',
  inputSchema: z.object({}),
  outputSchema: z.object({
    status: z.string(),
  }),
  execute: async ({}) => {
    // Read the number from attempts.txt, defaulting to 0 if file is empty or missing
    let attempts = 0;
    try {
      const content = fs.readFileSync(ATTEMPTS_FILE, 'utf-8').trim();
      if (content) {
        attempts = parseInt(content, 10);
      }
    } catch (error) {
      // File doesn't exist or can't be read, use default 0
      attempts = 0;
    }

    // Increment the number
    attempts = attempts + 1;

    // Write it back to attempts.txt
    fs.writeFileSync(ATTEMPTS_FILE, attempts.toString());

    // If less than 3, throw an error
    if (attempts < 3) {
      throw new Error(`Attempt ${attempts} failed (need 3 or more)`);
    }

    // If 3 or greater, return success
    return { status: 'success' };
  },
});

// Create the retryWorkflow with retry configuration
const retryWorkflow = createWorkflow({
  id: 'retry-workflow',
  inputSchema: z.object({}),
  outputSchema: z.object({
    status: z.string(),
  }),
  retryConfig: {
    attempts: 5,
    delay: 100,
  },
});

// Add the step to the workflow
retryWorkflow.then(unstableStep);

// Commit the workflow
const committedWorkflow = retryWorkflow.commit();

// Main execution
async function main() {
  // 1. Write 0 to attempts.txt
  fs.writeFileSync(ATTEMPTS_FILE, '0');

  // 2. Execute the workflow
  const run = await committedWorkflow.createRun();
  const result = await run.start({ inputData: {} });

  // 3. Write the stringified workflow result to result.json
  fs.writeFileSync(RESULT_FILE, JSON.stringify(result, null, 2));

  console.log('Workflow completed successfully!');
  console.log('Result:', result);
}

main().catch((error) => {
  console.error('Error executing workflow:', error);
  process.exit(1);
});