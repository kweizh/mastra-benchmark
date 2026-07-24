import { writeFileSync } from 'fs';
import { mastra } from './mastra/index.js';

async function askQuestion() {
  const question = 'What are the main advantages of the Transformer architecture?';
  
  console.log(`Asking question: ${question}`);
  console.log('Generating answer...');
  
  // Get the research agent
  const agent = mastra.getAgent('researchAgent');
  
  // Generate the response
  const response = await agent.generate(question);
  
  console.log('Answer generated!');
  console.log('Response:', response.text);
  
  // Save the response to /home/user/answer.txt
  writeFileSync('/home/user/answer.txt', response.text);
  
  console.log('Answer saved to /home/user/answer.txt');
}

askQuestion().catch(console.error);