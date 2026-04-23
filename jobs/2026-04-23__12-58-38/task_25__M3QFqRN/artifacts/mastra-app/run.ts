import { Mastra } from '@mastra/core';
import { InMemoryStore } from '@mastra/core/storage';
import { contentApprovalWorkflow } from './workflow';
import { writeFileSync } from 'fs';

// Initialize a Mastra instance with the workflow and storage
const mastra = new Mastra({
  workflows: {
    contentApprovalWorkflow,
  },
  storage: new InMemoryStore({ id: 'mastra-storage' }),
});

async function main() {
  // Get the workflow from the Mastra instance
  const workflow = mastra.getWorkflow('contentApprovalWorkflow');

  // Create a run
  const run = await workflow.createRun();

  // Start a run with input
  const result = await run.start({
    inputData: { content: 'Hello World' },
  });

  // Check if the run status is "suspended"
  if (result.status === 'suspended') {
    console.log('Workflow is suspended, resuming...');

    // Resume the run with resumeData
    const resumedResult = await run.resume({
      resumeData: { approved: true },
    });

    // Write the final workflow result to output.json
    writeFileSync(
      '/home/user/mastra-app/output.json',
      JSON.stringify(resumedResult.result, null, 2)
    );

    console.log('Result written to output.json:', resumedResult.result);
  } else {
    console.log('Run status:', result.status);
  }
}

main().catch(console.error);