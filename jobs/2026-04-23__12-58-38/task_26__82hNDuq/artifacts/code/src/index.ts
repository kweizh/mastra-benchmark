import { Mastra, Agent } from '@mastra/core';
import { Memory } from '@mastra/memory';

// Create a shared Memory instance for all agents
const sharedMemory = new Memory();

// Create the Coder agent with instructions to write TypeScript code
const coder = new Agent({
  name: 'coder',
  instructions: 'You are an expert TypeScript developer. Write clean, well-structured TypeScript code. Focus on best practices, type safety, and maintainability.',
  model: {
    provider: 'openai',
    name: 'gpt-4o-mini',
  },
  memory: sharedMemory,
});

// Create the Reviewer agent with instructions to review TypeScript code for security and performance
const reviewer = new Agent({
  name: 'reviewer',
  instructions: 'You are a code reviewer specializing in TypeScript. Review code for security vulnerabilities, performance issues, and best practices. Provide constructive feedback and suggest improvements.',
  model: {
    provider: 'openai',
    name: 'gpt-4o-mini',
  },
  memory: sharedMemory,
});

// Create the Supervisor agent with instructions to coordinate the coder and reviewer
const supervisor = new Agent({
  name: 'supervisor',
  instructions: `You are a supervisor agent that coordinates a team of specialized agents:
- coder: Writes TypeScript code
- reviewer: Reviews TypeScript code for security and performance

When you receive a user request:
1. First, instruct the coder to write the requested code
2. Then, instruct the reviewer to review the code
3. Synthesize the results and provide a final response to the user

Ensure all steps are completed and the final output includes both the code and the review.`,
  model: {
    provider: 'openai',
    name: 'gpt-4o-mini',
  },
  memory: sharedMemory,
});

// Create and export the Mastra instance with all registered agents
export const mastra = new Mastra({
  agents: [coder, reviewer, supervisor],
});

// Export individual agents and memory for direct access
export { coder, reviewer, supervisor, sharedMemory };