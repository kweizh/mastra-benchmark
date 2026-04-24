import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// Step 1: Initial step that takes a number value and returns it
const step1 = createStep({
  id: 'step1',
  inputSchema: { value: z.number() },
  outputSchema: { value: z.number() },
  execute: async ({ inputData }) => {
    return { value: inputData.value };
  },
});

// High value step: triggered when value > 10
const highValueStep = createStep({
  id: 'high-value-step',
  inputSchema: { value: z.number() },
  outputSchema: { result: z.string() },
  execute: async ({ inputData }) => {
    return { result: `High value: ${inputData.value}` };
  },
});

// Low value step: triggered when value <= 10
const lowValueStep = createStep({
  id: 'low-value-step',
  inputSchema: { value: z.number() },
  outputSchema: { result: z.string() },
  execute: async ({ inputData }) => {
    return { result: `Low value: ${inputData.value}` };
  },
});

// Final step: takes the output from either branch and returns a message
const finalStep = createStep({
  id: 'final-step',
  inputSchema: { result: z.string() },
  outputSchema: { message: z.string() },
  execute: async ({ inputData }) => {
    return { message: inputData.result };
  },
});

// Create the workflow with conditional branching
export const myWorkflow = createWorkflow({
  id: 'my-workflow',
})
  .then(step1)
  .branch([
    // Condition for high value branch
    [
      async ({ inputData }) => {
        return inputData.value > 10;
      },
      highValueStep,
    ],
    // Condition for low value branch
    [
      async ({ inputData }) => {
        return inputData.value <= 10;
      },
      lowValueStep,
    ],
  ])
  .then(finalStep)
  .commit();