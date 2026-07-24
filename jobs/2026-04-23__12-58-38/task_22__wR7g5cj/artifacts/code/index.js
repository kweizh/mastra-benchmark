import { Mastra } from '@mastra/core';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

// Create LibSQL storage pointing to file:mastra.db
const libsqlStore = new LibSQLStore({
  id: 'libsql-storage',
  url: 'file:./mastra.db',
});

// Create Memory instance with LibSQLStore
const memory = new Memory({
  storage: libsqlStore,
});

// Create an Agent with Memory and OpenAI GPT-4o model
const agent = new Agent({
  id: 'example-agent',
  name: 'Example Agent',
  instructions: 'You are a helpful assistant.',
  model: {
    provider: 'openai',
    name: 'gpt-4o',
  },
  memory: memory,
});

// Initialize Mastra instance with the agent
const mastra = new Mastra({
  agents: [agent],
  storage: libsqlStore,
});

// Log initialization
console.log('Mastra initialized successfully!');
console.log('Agent created:', agent.id);
console.log('Storage configured with LibSQLStore at file:./mastra.db');

// Export for potential external use
export { mastra, agent, memory, libsqlStore };