import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const weatherTool = createTool({
  id: 'weather-tool',
  description: 'Get the weather for a location',
  inputSchema: z.object({
    location: z.string()
  }),
  execute: async ({ inputData }) => {
    return { weather: `The weather in ${inputData.location} is sunny.` };
  }
});
