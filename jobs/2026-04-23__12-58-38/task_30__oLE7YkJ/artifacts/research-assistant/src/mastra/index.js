import { Mastra } from '@mastra/core';
import { researchAgent } from './agents/researchAgent.js';

// Create and export the Mastra instance
export const mastra = new Mastra({
  agents: {
    researchAgent,
  },
});