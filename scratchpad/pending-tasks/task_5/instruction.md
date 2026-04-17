# Mastra RAG Pipeline

## Background
You need to build a Retrieval-Augmented Generation (RAG) pipeline using Mastra. The pipeline will read a markdown file, chunk it, generate embeddings using OpenAI, and store them in a local libSQL vector database.

## Requirements
- Initialize a Node.js project in `/home/user/mastra-rag` and install the required dependencies: `@mastra/core`, `@mastra/rag`, `@mastra/libsql`, `ai`, `zod`, and `tsx`.
- Write a TypeScript script `rag.ts` that performs the following:
  1. Reads the content of `data.md` from the current directory.
  2. Uses `MDocument.fromText()` from `@mastra/rag` to initialize the document.
  3. Chunks the document using the `recursive` strategy with `size: 512` and `overlap: 50`.
  4. Generates embeddings for the chunks using `embedMany` from the `ai` package and `ModelRouterEmbeddingModel` from `@mastra/core/llm` with the `openai/text-embedding-3-small` model.
  5. Initializes a `LibSQLVector` store from `@mastra/libsql` connected to `file:mastra.db`.
  6. Creates an index named `embeddings` with a dimension of `1536`.
  7. Upserts the generated vectors into the `embeddings` index. The `metadata` for each vector MUST include the original chunk text in a `text` field.

## Constraints
- Project path: `/home/user/mastra-rag`
- The `data.md` file is already present in the project directory.
- Use `tsx` to run the script.
- You must use `libSQL` for the vector database.