import { createTool } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const calculatorTool = createTool({
  id: 'calculator',
  description: 'Perform basic arithmetic operations',
  inputSchema: z.object({
    a: z.number(),
    b: z.number(),
    operation: z.enum(['add', 'subtract', 'multiply', 'divide']),
  }),
  execute: async ({ a, b, operation }) => {
    let result: number;

    switch (operation) {
      case 'add':
        result = a + b;
        break;
      case 'subtract':
        result = a - b;
        break;
      case 'multiply':
        result = a * b;
        break;
      case 'divide':
        if (b === 0) {
          throw new Error('Division by zero is not allowed.');
        }
        result = a / b;
        break;
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }

    return { result };
  },
});

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is required.');
}
process.env.OPENAI_API_KEY = apiKey;

const agent = new Agent({
  id: 'calculator-agent',
  name: 'Calculator Agent',
  instructions:
    'You are a math assistant. Use the calculator tool for all arithmetic and answer with the final numeric result.',
  model: 'openai/gpt-4o-mini',
  tools: {
    calculator: calculatorTool,
  },
});

const outputPath = resolve('/home/user/calculator-agent/output.log');

const run = async () => {
  const response = await agent.generate('What is 15 multiplied by 7?');
  await writeFile(outputPath, response.text, 'utf8');
  console.log(response.text);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
