import { createTool } from '@mastra/core/tools';
import { Agent } from '@mastra/core/agent';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// Define the calculator tool
const calculatorTool = createTool({
  id: 'calculator',
  description:
    'Performs basic arithmetic operations: add, subtract, multiply, divide.',
  inputSchema: z.object({
    a: z.number().describe('The first number'),
    b: z.number().describe('The second number'),
    operation: z
      .enum(['add', 'subtract', 'multiply', 'divide'])
      .describe('The arithmetic operation to perform'),
  }),
  execute: async (inputData): Promise<{ result: number }> => {
    const { a, b, operation } = inputData;
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
          throw new Error('Division by zero is not allowed');
        }
        result = a / b;
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return { result };
  },
});

// Create the agent
const calculatorAgent = new Agent({
  name: 'Calculator Agent',
  instructions:
    'You are a helpful math assistant. When asked to perform arithmetic calculations, always use the calculator tool to compute the result. Provide clear, concise answers.',
  model: 'openai/gpt-4o-mini',
  tools: {
    calculator: calculatorTool,
  },
});

// Main execution
async function main() {
  const question = 'What is 15 multiplied by 7?';
  console.log(`Asking agent: "${question}"`);

  const response = await calculatorAgent.generate(question);

  const outputText = response.text;
  console.log('Agent response:', outputText);

  // Write output to log file
  const logPath = path.join(__dirname, 'output.log');
  fs.writeFileSync(logPath, outputText, 'utf-8');
  console.log(`Output written to ${logPath}`);
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
