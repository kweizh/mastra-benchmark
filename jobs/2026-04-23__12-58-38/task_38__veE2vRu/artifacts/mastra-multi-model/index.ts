import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { createMastra } from '@mastra/core';
import fs from 'fs';
import path from 'path';

// Get API keys from environment
const openaiApiKey = process.env.OPENAI_API_KEY;
const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

if (!openaiApiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

if (!anthropicApiKey) {
  throw new Error('ANTHROPIC_API_KEY environment variable is not set');
}

// Create the OpenAI agent
const openaiAgent = new Agent({
  name: 'openai-agent',
  instructions: 'You are an OpenAI assistant.',
  model: {
    provider: 'openai',
    name: 'gpt-4o',
    apiKey: openaiApiKey,
  },
});

// Create the Anthropic agent
const anthropicAgent = new Agent({
  name: 'anthropic-agent',
  instructions: 'You are an Anthropic assistant.',
  model: {
    provider: 'anthropic',
    name: 'claude-3-5-sonnet-20240620',
    apiKey: anthropicApiKey,
  },
});

// Create Mastra instance
const mastra = createMastra({
  agents: [openaiAgent, anthropicAgent],
});

// Main function to run the agents
async function main() {
  const prompt = 'Say hello';
  const output = [];

  console.log('Running OpenAI agent...');
  try {
    const openaiResponse = await openaiAgent.generate(prompt);
    output.push('=== OpenAI Agent Response ===');
    output.push(openaiResponse.text || openaiResponse);
    output.push('');
  } catch (error) {
    output.push('=== OpenAI Agent Error ===');
    output.push(String(error));
    output.push('');
  }

  console.log('Running Anthropic agent...');
  try {
    const anthropicResponse = await anthropicAgent.generate(prompt);
    output.push('=== Anthropic Agent Response ===');
    output.push(anthropicResponse.text || anthropicResponse);
    output.push('');
  } catch (error) {
    output.push('=== Anthropic Agent Error ===');
    output.push(String(error));
    output.push('');
  }

  // Write output to log file
  const logPath = path.join(__dirname, 'output.log');
  fs.writeFileSync(logPath, output.join('\n'), 'utf-8');
  console.log(`Output written to ${logPath}`);
}

main().catch((error) => {
  console.error('Error running agents:', error);
  process.exit(1);
});