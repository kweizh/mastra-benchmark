const { Mastra } = require('@mastra/core');
const { Agent } = require('@mastra/core/agent');
const { Memory } = require('@mastra/memory');
const { LibSQLStore } = require('@mastra/libsql');

// 1. Create a LibSQLStore that persists to a local SQLite database file
const storage = new LibSQLStore({
  id: 'mastra-storage',
  url: 'file:mastra.db',
});

// 2. Create a Memory instance backed by LibSQLStore
const memory = new Memory({
  storage,
});

// 3. Define an agent that uses the memory instance
const assistantAgent = new Agent({
  id: 'assistant',
  name: 'Assistant',
  instructions: 'You are a helpful assistant with persistent memory.',
  model: 'openai/gpt-4o',
  memory,
});

// 4. Initialise the Mastra instance with the agent and storage
const mastra = new Mastra({
  agents: { assistant: assistantAgent },
  storage,
});

console.log('Mastra instance initialised successfully.');
console.log('Agent:', mastra.getAgent('assistant').name);
console.log('Storage URL:', 'file:mastra.db');
console.log('Database file will be created at: mastra.db (relative to CWD)');
