import { Agent } from '@mastra/core/agent';
import { LibSQLVector } from '@mastra/libsql';
import { createVectorQueryTool } from '@mastra/rag';
import { openai } from '@ai-sdk/openai';

// Initialize LibSQLVector database
const libSqlVector = new LibSQLVector({
  id: 'libsql-vector-store',
  url: 'file:/home/user/research-assistant/vector.db',
});

// Create the vector query tool with proper embedding model
const vectorQueryTool = createVectorQueryTool({
  name: 'query_papers',
  description: 'Query the research papers database to find relevant information',
  vectorStore: libSqlVector,
  indexName: 'papers',
  model: openai.embedding('text-embedding-3-small'),
});

// Create the Research Assistant agent
export const researchAgent = new Agent({
  name: 'Research Assistant',
  id: 'research-agent',
  instructions: `
    You are a research assistant that helps answer questions based on academic papers.
    Use the query_papers tool to search for relevant information in the database.
    Provide detailed and accurate answers based on the retrieved information.
    If the retrieved information doesn't contain enough detail to answer the question, 
    acknowledge the limitations and provide the best possible answer with available information.
  `,
  model: 'openai/gpt-4o-mini',
  tools: { query_papers: vectorQueryTool },
});