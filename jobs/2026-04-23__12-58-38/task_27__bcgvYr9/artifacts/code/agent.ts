import { Agent } from '@mastra/core/agent';
import { createOpenAI } from '@ai-sdk/openai';
import { mcp } from './mcp';

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const filesystemAgent = new Agent({
  name: 'filesystem-agent',
  instructions: 'You are a helpful agent that can interact with the filesystem.',
  model: openai('gpt-4o-mini'),
  tools: await mcp.listTools(),
});