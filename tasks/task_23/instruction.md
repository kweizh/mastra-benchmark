# Mastra RAG Pipeline

## Background
Build a Retrieval-Augmented Generation (RAG) pipeline using the Mastra framework. You will need to parse a provided markdown file, chunk the text, generate embeddings, and store them in a vector database to answer questions based on the document.

## Requirements
- Initialize a Mastra project in `/home/user/myproject`.
- Install necessary dependencies (`@mastra/core`, `@mastra/rag`, etc.).
- Create a script `index.ts` that:
  1. Reads a markdown file `/home/user/myproject/data.md`.
  2. Chunks the document using Mastra's RAG utilities.
  3. Generates embeddings for the chunks using an OpenAI model (e.g., `text-embedding-3-small` or similar supported by Mastra).
  4. Stores the embeddings in a local vector store (e.g., LibSQL or a simple in-memory store if supported, or PgLite).
  5. Queries the vector store with a specific question: "What is the main topic of the document?"
  6. Outputs the retrieved chunks or the final LLM answer to `/home/user/myproject/output.log`.

## Implementation Guide
1. Run `mkdir -p /home/user/myproject && cd /home/user/myproject`.
2. Initialize a Node.js project: `npm init -y`.
3. Install dependencies: `npm install @mastra/core @mastra/rag dotenv` and TypeScript types if needed.
4. Write `index.ts` to implement the RAG pipeline.
5. Execute the script using `npx tsx index.ts`.

## Constraints
- Project path: `/home/user/myproject`
- Input file: `/home/user/myproject/data.md`
- Log file: `/home/user/myproject/output.log`
- You must use Mastra's RAG capabilities.

## Integrations
- OpenAI (for embeddings and LLM)