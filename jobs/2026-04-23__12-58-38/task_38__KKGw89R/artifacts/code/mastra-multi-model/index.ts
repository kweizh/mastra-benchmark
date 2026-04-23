import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import * as fs from 'fs';
import * as path from 'path';

// Create OpenAI agent
const openaiAgent = new Agent({
  id: 'openai-agent',
  name: 'OpenAI Agent',
  instructions: 'You are an OpenAI assistant.',
  model: {
    id: 'openai/gpt-4o',
    apiKey: process.env.OPENAI_API_KEY,
  },
});

// Create Anthropic agent
const anthropicAgent = new Agent({
  id: 'anthropic-agent',
  name: 'Anthropic Agent',
  instructions: 'You are an Anthropic assistant.',
  model: {
    id: 'anthropic/claude-3-5-sonnet-20240620',
    apiKey: process.env.ANTHROPIC_API_KEY,
  },
});

// Create Mastra instance with both agents
const mastra = new Mastra({
  agents: {
    'openai-agent': openaiAgent,
    'anthropic-agent': anthropicAgent,
  },
});

async function main() {
  console.log('Starting Mastra multi-model agents...');
  
  // Get the agents from Mastra
  const openai = mastra.getAgent('openai-agent');
  const anthropic = mastra.getAgent('anthropic-agent');
  
  console.log('Prompting OpenAI agent...');
  const openaiResponse = await openai.generate('Say hello');
  console.log('OpenAI agent response:', openaiResponse.text);
  
  console.log('Prompting Anthropic agent...');
  const anthropicResponse = await anthropic.generate('Say hello');
  console.log('Anthropic agent response:', anthropicResponse.text);
  
  // Prepare output
  const output = `
=== Mastra Multi-Model Agent Output ===
Timestamp: ${new Date().toISOString()}

OpenAI Agent (openai/gpt-4o):
${openaiResponse.text}

Anthropic Agent (anthropic/claude-3-5-sonnet-20240620):
${anthropicResponse.text}
=========================================
`;
  
  // Write to output.log
  const outputPath = path.join(__dirname, 'output.log');
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`\nOutput written to: ${outputPath}`);
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});