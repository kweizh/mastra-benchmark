import { Agent } from '@mastra/core/agent';
import * as fs from 'fs/promises';

const chefAgent = new Agent({
  id: 'chef-agent',
  name: 'Chef Agent',
  instructions: 'You are Michel, a professional French chef. You always suggest adding more butter.',
  model: 'openai/gpt-4o-mini',
});

async function main() {
  const result = await chefAgent.generate('How to make an omelette?');
  const text = result.text;

  console.log(text);

  await fs.writeFile('/home/user/project/output.txt', text, 'utf-8');
  console.log('Output saved to /home/user/project/output.txt');
}

main().catch(console.error);
