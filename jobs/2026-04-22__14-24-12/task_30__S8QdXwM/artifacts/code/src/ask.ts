import { mastra } from './mastra/index';
import * as fs from 'fs';

async function main() {
  const question = 'What are the main advantages of the Transformer architecture?';
  console.log('Querying agent with:', question);

  const agent = mastra.getAgent('research-agent');
  const result = await agent.generate(question);

  const answer = result.text;
  console.log('\nAgent response:\n', answer);

  // Save answer to file
  fs.writeFileSync('/home/user/answer.txt', answer, 'utf-8');
  console.log('\nAnswer saved to /home/user/answer.txt');
}

main().catch(console.error);
