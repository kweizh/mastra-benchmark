import { Mastra } from '@mastra/core';
import { InMemoryStore } from '@mastra/core/storage';
import { writeFile } from 'node:fs/promises';
import { contentApprovalWorkflow } from './workflow';

const runWorkflow = async () => {
  const mastra = new Mastra({
    workflows: { contentApprovalWorkflow },
    storage: new InMemoryStore(),
  });

  const workflow = mastra.getWorkflow('contentApprovalWorkflow');
  const run = await workflow.createRun();

  const startResult = await run.start({
    inputData: {
      content: 'Hello World',
    },
  });

  let finalResult = startResult;

  if (startResult.status === 'suspended') {
    finalResult = await run.resume({
      step: 'reviewStep',
      resumeData: { approved: true },
    });
  }

  if (finalResult.status !== 'success') {
    throw new Error(`Workflow did not complete successfully: ${finalResult.status}`);
  }

  await writeFile(
    '/home/user/mastra-app/output.json',
    `${JSON.stringify(finalResult.result, null, 2)}\n`,
    'utf-8'
  );
};

runWorkflow();
