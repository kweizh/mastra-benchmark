const { Mastra } = require('@mastra/core');
const { Agent } = require('@mastra/core/agent');
const { Memory } = require('@mastra/memory');
const { LibSQLStore } = require('@mastra/libsql');

const storage = new LibSQLStore({
  id: 'mastra-storage',
  url: 'file:mastra.db',
});

const memory = new Memory({
  storage,
});

const assistantAgent = new Agent({
  id: 'assistant',
  name: 'assistant',
  model: 'openai/gpt-4o',
  memory,
});

const mastra = new Mastra({
  storage,
  agents: {
    assistant: assistantAgent,
  },
});

async function main() {
  await storage.init();
  console.log('Mastra initialized with LibSQL storage.');
  console.log('Registered agents:', Object.keys(mastra.listAgents()));
}

main().catch((error) => {
  console.error('Failed to initialize Mastra:', error);
  process.exit(1);
});
