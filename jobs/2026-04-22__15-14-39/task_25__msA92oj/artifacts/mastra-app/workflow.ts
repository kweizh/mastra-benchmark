import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

const reviewStep = createStep({
  id: 'reviewStep',
  inputSchema: z.object({
    content: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  resumeSchema: z.object({
    approved: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    if (!resumeData) {
      return await suspend();
    }

    const { content } = inputData;

    if (resumeData?.approved) {
      return { result: `Publish: ${content}` };
    }

    return { result: `Discard: ${content}` };
  },
});

export const contentApprovalWorkflow = createWorkflow({
  id: 'content-approval-workflow',
  inputSchema: z.object({
    content: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
})
  .then(reviewStep)
  .commit();
