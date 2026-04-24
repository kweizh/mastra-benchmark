import 'dotenv/config';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';

const requiredEnvVars = ['OPENAI_API_KEY', 'ANTHROPIC_API_KEY'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
const logPath = resolve('/home/user/mastra-multi-model/output.log');

const openaiAgent = new Agent({
  id: 'openai-agent',
  name: 'openai-agent',
  instructions: 'You are an OpenAI assistant.',
  model: 'openai/gpt-4o',
});

const anthropicAgent = new Agent({
  id: 'anthropic-agent',
  name: 'anthropic-agent',
  instructions: 'You are an Anthropic assistant.',
  model: 'anthropic/claude-3-5-sonnet-20240620',
});

const mastra = new Mastra({
  agents: {
    'openai-agent': openaiAgent,
    'anthropic-agent': anthropicAgent,
  },
});

const formatLog = (openaiText: string, anthropicText: string) => {
  return [
    'OpenAI Agent Response:',
    openaiText.trim(),
    '',
    'Anthropic Agent Response:',
    anthropicText.trim(),
    '',
  ].join('\n');
};

const main = async () => {
  if (missingEnvVars.length > 0) {
    const message = `Missing environment variables: ${missingEnvVars.join(', ')}`;
    await writeFile(logPath, `${message}\n`);
    throw new Error(message);
  }

  const prompt = 'Say hello';
  const [openaiResult, anthropicResult] = await Promise.allSettled([
    mastra.getAgent('openai-agent').generate(prompt),
    mastra.getAgent('anthropic-agent').generate(prompt),
  ]);

  const openaiText =
    openaiResult.status === 'fulfilled'
      ? openaiResult.value.text
      : `Error: ${openaiResult.reason instanceof Error ? openaiResult.reason.message : String(openaiResult.reason)}`;
  const anthropicText =
    anthropicResult.status === 'fulfilled'
      ? anthropicResult.value.text
      : `Error: ${anthropicResult.reason instanceof Error ? anthropicResult.reason.message : String(anthropicResult.reason)}`;

  await writeFile(logPath, formatLog(openaiText, anthropicText));
};

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  await writeFile(logPath, `Error: ${message}\n`);
  process.exitCode = 1;
});
