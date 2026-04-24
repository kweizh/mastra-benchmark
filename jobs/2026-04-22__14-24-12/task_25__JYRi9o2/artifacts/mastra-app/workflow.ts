import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";

const reviewStep = createStep({
  id: "reviewStep",
  inputSchema: z.object({
    content: z.string(),
  }),
  resumeSchema: z.object({
    approved: z.boolean(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { content } = inputData;
    const { approved } = resumeData ?? {};

    if (approved === undefined) {
      return await suspend({});
    }

    if (approved) {
      return { result: "Publish: " + content };
    } else {
      return { result: "Discard: " + content };
    }
  },
});

export const contentApprovalWorkflow = createWorkflow({
  id: "contentApprovalWorkflow",
  inputSchema: z.object({
    content: z.string(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
})
  .then(reviewStep)
  .commit();
