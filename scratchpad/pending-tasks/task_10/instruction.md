# Mastra RAG Pipeline

## Background
Build a Retrieval-Augmented Generation (RAG) pipeline using Mastra to answer questions based on a provided knowledge base.

## Requirements
- Initialize a Node.js project in `/home/user/mastra-rag`.
- The directory already contains a `knowledge.md` file.
- Implement a script `ingest.ts` that reads `knowledge.md`, chunks the text using Mastra's RAG modules, and stores the embeddings in a local vector database (e.g., using LibSQL or similar embedded store supported by Mastra).
- Implement a script `query.ts` that takes a question as a CLI argument, retrieves relevant chunks from the vector database, and uses a Mastra Agent (using `openai/gpt-4o`) to generate an answer.
- The answer must be printed to stdout.

## Implementation Guide
1. Run `npm init -y` in `/home/user/mastra-rag`.
2. Install `@mastra/core`, `@mastra/memory`, `@mastra/rag`, `zod`, `tsx`, and any other required dependencies.
3. Write `ingest.ts` to process `knowledge.md` and populate the local vector store.
4. Write `query.ts` that accepts a query string, performs similarity search, and passes the context to an Agent to formulate the final response.

## Constraints
- Project path: `/home/user/mastra-rag`
- Both scripts should be runnable via `npx tsx <script>`.
- Use `OPENAI_API_KEY` for embeddings and agent generation.

## Integrations
- OpenAI