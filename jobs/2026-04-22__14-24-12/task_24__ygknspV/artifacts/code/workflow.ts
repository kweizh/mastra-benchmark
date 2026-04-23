import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: pass-through step that accepts { value } and returns { value }
const step1 = createStep({
  id: 'step1',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ value: z.number() }),
  execute: async ({ inputData }) => {
    return { value: inputData.value };
  },
});

// High value branch step
const highValueStep = createStep({
  id: 'high-value-step',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    return { result: `High value: ${inputData.value}` };
  },
});

// Low value branch step
const lowValueStep = createStep({
  id: 'low-value-step',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData }) => {
    return { result: `Low value: ${inputData.value}` };
  },
});

// Final step: merges output from whichever branch ran
const finalStep = createStep({
  id: 'final-step',
  inputSchema: z.object({
    'high-value-step': z.object({ result: z.string() }).optional(),
    'low-value-step': z.object({ result: z.string() }).optional(),
  }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ inputData }) => {
    const result =
      inputData['high-value-step']?.result ??
      inputData['low-value-step']?.result ??
      '';
    return { message: result };
  },
});

// Assemble the workflow
export const myWorkflow = createWorkflow({
  id: 'my-workflow',
  inputSchema: z.object({ value: z.number() }),
  outputSchema: z.object({ message: z.string() }),
})
  .then(step1)
  .branch([
    [
      async ({ inputData }) => inputData.value > 10,
      highValueStep,
    ],
    [
      async ({ inputData }) => inputData.value <= 10,
      lowValueStep,
    ],
  ])
  .then(finalStep)
  .commit();
