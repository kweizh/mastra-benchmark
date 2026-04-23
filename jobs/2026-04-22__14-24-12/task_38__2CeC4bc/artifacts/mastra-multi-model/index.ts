import 'dotenv/config';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Agent definitions
// ---------------------------------------------------------------------------

const openaiAgent = new Agent({
  name: 'openai-agent',
  instructions: 'You are an OpenAI assistant.',
  model: openai('gpt-4o'),
});

const anthropicAgent = new Agent({
  name: 'anthropic-agent',
  instructions: 'You are an Anthropic assistant.',
  model: anthropic('claude-3-5-sonnet-20240620'),
});

// ---------------------------------------------------------------------------
// Mastra instance
// ---------------------------------------------------------------------------

const mastra = new Mastra({
  agents: {
    'openai-agent': openaiAgent,
    'anthropic-agent': anthropicAgent,
  },
});

// ---------------------------------------------------------------------------
// Helper: call generate and return the response text (or an error message)
// ---------------------------------------------------------------------------

async function callAgent(agentName: string, prompt: string): Promise<string> {
  const agent = mastra.getAgent(agentName);
  const result = await agent.generate(prompt);
  return result.text;
}

// ---------------------------------------------------------------------------
// Main: prompt both agents and write results to output.log
// ---------------------------------------------------------------------------

async function main() {
  const prompt = 'Say hello';
  const logLines: string[] = [];
  const timestamp = new Date().toISOString();

  console.log(`Timestamp : ${timestamp}`);
  console.log(`Prompt    : "${prompt}"\n`);

  const agents = [
    { name: 'openai-agent', label: '[openai-agent]' },
    { name: 'anthropic-agent', label: '[anthropic-agent]' },
  ] as const;

  for (const { name, label } of agents) {
    console.log(`Calling ${name}...`);
    let response: string;
    try {
      response = await callAgent(name, prompt);
      console.log(`${name} response: ${response}\n`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      response = `ERROR: ${message}`;
      console.error(`${name} error: ${message}\n`);
    }

    logLines.push(label);
    logLines.push(`Prompt   : ${prompt}`);
    logLines.push(`Response : ${response}`);
    logLines.push('');
  }

  // --- Write log file ---
  const logPath = path.resolve(process.cwd(), 'output.log');
  const content =
    `# Mastra Multi-Model Agent Run\n` +
    `Timestamp: ${timestamp}\n\n` +
    logLines.join('\n') +
    '\n';

  fs.writeFileSync(logPath, content, 'utf8');
  console.log(`Results saved to ${logPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
