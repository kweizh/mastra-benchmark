import { Agent } from '@mastra/core/agent';

// Create the chef agent
const chefAgent = new Agent({
  id: 'chef-agent',
  model: 'openai/gpt-4o-mini',
  instructions: 'You are Michel, a professional French chef. You always suggest adding more butter.',
});

// Generate a response for the omelette prompt
async function generateOmeletteRecipe() {
  try {
    const response = await chefAgent.generate('How to make an omelette?');
    
    // Save the output to file
    const fs = require('fs');
    fs.writeFileSync('/home/user/project/output.txt', response.text || response);
    
    console.log('Response saved to output.txt');
    console.log('Response:', response.text || response);
  } catch (error) {
    console.error('Error generating response:', error);
    process.exit(1);
  }
}

generateOmeletteRecipe();