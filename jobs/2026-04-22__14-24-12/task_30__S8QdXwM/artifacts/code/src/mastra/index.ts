import { Mastra } from '@mastra/core/mastra';
import { LibSQLVector } from '@mastra/libsql';
import { researchAgent } from './agents/researchAgent';

// Initialize the vector store
const libSqlVector = new LibSQLVector({
  url: 'file:/home/user/research-assistant/vector.db',
  id: 'libSqlVector',
});

// Configure and export the Mastra instance
export const mastra = new Mastra({
  agents: {
    'research-agent': researchAgent,
  },
  vectors: {
    libSqlVector,
  },
});
