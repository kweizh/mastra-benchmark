import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

const reviewStep = createStep({
  id: 'reviewStep',
  resumeSchema: z.object({
    approved: z.boolean(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { content } = inputData;

    // Suspend if resumeData is not provided
    if (!resumeData) {
      return await suspend();
    }

    // After resumption, process based on approval status
    const result = resumeData.approved
      ? `Publish: ${content}`
      : `Discard: ${content}`;

    return { result };
  },
});

export const contentApprovalWorkflow = createWorkflow({
  id: 'contentApprovalWorkflow',
  inputSchema: z.object({
    content: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
}).then(reviewStep).commit();