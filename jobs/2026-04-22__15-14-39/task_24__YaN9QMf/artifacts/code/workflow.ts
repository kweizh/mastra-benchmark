import { createStep, createWorkflow } from "@mastra/core/workflows";
import { z } from "zod";

export const step1 = createStep({
  id: "step1",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    value: z.number(),
  }),
  execute: async ({ input }) => {
    return { value: input.value };
  },
});

export const highValueStep = createStep({
  id: "high-value-step",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ input }) => {
    return { result: `High value: ${input.value}` };
  },
});

export const lowValueStep = createStep({
  id: "low-value-step",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ input }) => {
    return { result: `Low value: ${input.value}` };
  },
});

export const finalStep = createStep({
  id: "final-step",
  inputSchema: z.object({
    result: z.string(),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
  execute: async ({ input }) => {
    return { message: input.result };
  },
});

export const myWorkflow = createWorkflow({
  id: "my-workflow",
  inputSchema: z.object({
    value: z.number(),
  }),
  outputSchema: z.object({
    message: z.string(),
  }),
})
  .then(step1)
  .branch((context) => (context.input.value > 10 ? "high" : "low"), {
    high: (branch) => branch.then(highValueStep),
    low: (branch) => branch.then(lowValueStep),
  })
  .then(finalStep)
  .commit();
