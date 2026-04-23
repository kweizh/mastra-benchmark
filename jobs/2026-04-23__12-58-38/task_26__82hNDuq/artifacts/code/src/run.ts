import { mastra } from './index';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

async function main() {
  console.log('Initializing Mastra system...');
  
  // Get the supervisor agent
  const supervisorAgent = mastra.getAgent('supervisor');
  
  if (!supervisorAgent) {
    throw new Error('Supervisor agent not found');
  }
  
  console.log('Sending request to supervisor agent...');
  
  // Send the request to the supervisor agent
  const response = await supervisorAgent.generate({
    messages: [
      {
        role: 'user',
        content: 'Write a simple Express server and review it',
      },
    ],
  });
  
  // Extract the response text
  const output = response.text || JSON.stringify(response, null, 2);
  
  console.log('Received response from supervisor agent');
  console.log('Writing output to file...');
  
  // Write the output to output.txt
  const outputPath = resolve(__dirname, '..', 'output.txt');
  writeFileSync(outputPath, output, 'utf-8');
  
  console.log(`Output written to: ${outputPath}`);
  console.log('\n--- Output Content ---');
  console.log(output);
  console.log('--- End of Output ---\n');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});