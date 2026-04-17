# Mastra Research Assistant (RAG)

## Background
You need to build an AI research assistant using Mastra's RAG capabilities. The assistant will process a local markdown file, generate embeddings, store them in a local libSQL database, and use a vector query tool to answer questions based on the document.

## Requirements
- Initialize a Node.js project for Mastra in `/home/user/research-assistant`.
- Process the provided `/home/user/paper.md` file into chunks and generate embeddings using `openai/text-embedding-3-small`.
- Store the embeddings in a `LibSQLVector` database located at `file:/home/user/research-assistant/vector.db` with the index name `papers`.
- Create a Mastra agent named `Research Assistant` with ID `research-agent` using the `openai/gpt-4o-mini` model.
- Equip the agent with a vector query tool connected to the `libSqlVector` store and `papers` index.
- Create a script that queries the agent and saves the response to `/home/user/answer.txt`.

## Implementation Guide
1. Initialize the project in `/home/user/research-assistant` and install dependencies: `@mastra/core`, `@mastra/rag`, `@mastra/libsql`, `ai`, and `zod`.
2. Create `src/store.ts` to read `/home/user/paper.md`, chunk it using `MDocument.fromText` (recursive strategy, maxSize 512, overlap 50), generate embeddings, and upsert them into `LibSQLVector` (`vector.db`).
3. Create `src/mastra/agents/researchAgent.ts` to define the agent with the vector query tool.
4. Create `src/mastra/index.ts` to configure and export the Mastra instance with the agent and vector store.
5. Run the `src/store.ts` script to populate the vector database.
6. Create and run `src/ask.ts` to query the agent with: "What are the main advantages of the Transformer architecture?" and write the generated text to `/home/user/answer.txt`.

## Constraints
- Project path: `/home/user/research-assistant`
- Log file: `/home/user/answer.txt`
- The database must be created at `/home/user/research-assistant/vector.db`.
- Ensure you use `openai/text-embedding-3-small` for embeddings and `openai/gpt-4o-mini` for the agent.