import { Agent } from '@mastra/core/agent';
import { createVectorQueryTool } from '@mastra/rag';
import { LibSQLVector } from '@mastra/libsql';
import { openai } from '@ai-sdk/openai';

// Initialize the LibSQL vector store
const libSqlVector = new LibSQLVector({
  url: 'file:/home/user/research-assistant/vector.db',
  id: 'libSqlVector',
});

// Create the vector query tool connected to the libSqlVector store and "papers" index
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: 'libSqlVector',
  vectorStore: libSqlVector,
  indexName: 'papers',
  model: openai.embedding('text-embedding-3-small'),
  id: 'papers-vector-query',
  description:
    'Search the research paper knowledge base for relevant information.',
});

// Define the Research Assistant agent
export const researchAgent = new Agent({
  id: 'research-agent',
  name: 'Research Assistant',
  instructions: `You are a helpful research assistant. You answer questions by searching the knowledge base of research papers.
When answering questions, use the vector query tool to find relevant information from the papers, then synthesize a comprehensive and accurate answer based on the retrieved context.`,
  model: openai('gpt-4o-mini'),
  tools: {
    vectorQuery: vectorQueryTool,
  },
});
