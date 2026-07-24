import fs from "node:fs/promises";
import { MDocument } from "@mastra/rag";
import { LibSQLVector } from "@mastra/libsql";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";

const sourcePath = "/home/user/paper.md";
const vectorDbUrl = "file:/home/user/research-assistant/vector.db";
const indexName = "papers";

const embeddingModel = openai.embedding("text-embedding-3-small");

const createVectorStore = () =>
  new LibSQLVector({
    id: "libSqlVector",
    url: vectorDbUrl,
  });

const loadChunks = async () => {
  const markdown = await fs.readFile(sourcePath, "utf-8");
  const document = MDocument.fromText(markdown, { source: sourcePath });
  const chunks = await document.chunk({
    strategy: "recursive",
    maxSize: 512,
    overlap: 50,
  });

  return chunks.map((chunk) => chunk.getText());
};

const ensureIndex = async (vectorStore: LibSQLVector, dimension: number) => {
  const indexes = await vectorStore.listIndexes();
  if (!indexes.includes(indexName)) {
    await vectorStore.createIndex({
      indexName,
      dimension,
      metric: "cosine",
    });
  }
};

const upsertChunks = async (chunkTexts: string[]) => {
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunkTexts,
  });

  const vectorStore = createVectorStore();
  await ensureIndex(vectorStore, embeddings[0]?.length ?? 0);

  await vectorStore.upsert({
    indexName,
    vectors: embeddings,
    ids: chunkTexts.map((_, index) => `paper-${index}`),
    metadata: chunkTexts.map((text, index) => ({
      text,
      source: sourcePath,
      chunk: index,
    })),
    deleteFilter: { source: sourcePath },
  });

  console.log(`Upserted ${embeddings.length} chunks into ${indexName}.`);
};

const main = async () => {
  const chunkTexts = await loadChunks();
  if (chunkTexts.length === 0) {
    throw new Error("No chunks were produced from the source document.");
  }

  await upsertChunks(chunkTexts);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
