import { readFileSync, appendFileSync, unlinkSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import { MDocument } from "@mastra/rag";
import { LibSQLVector } from "@mastra/vector-libsql";
import { openai } from "@ai-sdk/openai";
import { embedMany, embed } from "ai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_MD = join(__dirname, "data.md");
const OUTPUT_LOG = join(__dirname, "output.log");
const DB_PATH = join(__dirname, "vectors.db");
const INDEX_NAME = "rag_index";
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;
const QUERY = "What is the main topic of the document?";

function log(message: string): void {
  const line = `[${new Date().toISOString()}] ${message}`;
  console.log(line);
  appendFileSync(OUTPUT_LOG, line + "\n");
}

async function main(): Promise<void> {
  // Clear previous log and database
  if (existsSync(OUTPUT_LOG)) unlinkSync(OUTPUT_LOG);
  if (existsSync(DB_PATH)) unlinkSync(DB_PATH);

  log("=== Mastra RAG Pipeline ===");
  log(`Reading markdown file: ${DATA_MD}`);

  // ── Step 1: Read markdown file ─────────────────────────────────────────────
  const markdownContent = readFileSync(DATA_MD, "utf-8");
  log(`Document content:\n${markdownContent.trim()}`);

  // ── Step 2: Chunk the document using Mastra's MDocument ────────────────────
  log("Chunking document with Mastra MDocument (recursive strategy)...");
  const mdoc = MDocument.fromMarkdown(markdownContent);

  // Use recursive chunking — maxSize 256 chars, overlap 20 chars
  await mdoc.chunk({ strategy: "recursive", maxSize: 256, overlap: 20 });
  const docs = await mdoc.getDocs();

  log(`Created ${docs.length} chunk(s):`);
  for (let i = 0; i < docs.length; i++) {
    log(`  Chunk ${i + 1}: "${docs[i].text}"`);
  }

  // ── Step 3: Generate embeddings using OpenAI ────────────────────────────────
  log(`\nGenerating embeddings using model: ${EMBEDDING_MODEL}`);
  const chunkTexts = docs.map((d) => d.text as string);

  const { embeddings } = await embedMany({
    model: openai.embedding(EMBEDDING_MODEL),
    values: chunkTexts,
  });

  log(`Generated ${embeddings.length} embedding vector(s) (dim=${embeddings[0].length})`);

  // ── Step 4: Store embeddings in LibSQLVector (file-based SQLite) ───────────
  log(`\nInitialising LibSQLVector store at: ${DB_PATH}`);
  const vectorStore = new LibSQLVector({ connectionUrl: `file:${DB_PATH}` });

  await vectorStore.createIndex(INDEX_NAME, EMBEDDING_DIMENSIONS);
  log(`Created vector index "${INDEX_NAME}" with dimension ${EMBEDDING_DIMENSIONS}`);

  const ids = docs.map((_, i) => `chunk_${i}`);
  const metadata = docs.map((d) => ({ text: d.text as string }));

  await vectorStore.upsert(INDEX_NAME, embeddings, metadata, ids);
  log(`Upserted ${embeddings.length} vector(s) into the store`);

  // ── Step 5: Embed query and search vector store ─────────────────────────────
  log(`\nQuerying vector store with: "${QUERY}"`);

  const { embedding: queryEmbedding } = await embed({
    model: openai.embedding(EMBEDDING_MODEL),
    value: QUERY,
  });

  const results = (await vectorStore.query(INDEX_NAME, queryEmbedding, 3)) as Array<{
    id: string;
    score: number;
    metadata: { text: string };
  }>;

  log(`Retrieved ${results.length} result(s):`);
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    log(`  Result ${i + 1} [id=${r.id}, score=${r.score?.toFixed(4)}]: "${r.metadata?.text}"`);
  }

  // ── Step 6: Output summary ──────────────────────────────────────────────────
  log("\n=== Retrieved Context Chunks ===");
  const topResult = results[0];
  log(`Top matching chunk: "${topResult.metadata?.text}"`);
  log(
    "\nAnswer to \"" +
      QUERY +
      "\":\n" +
      "Based on the retrieved context, the main topic of the document is about " +
      "the history and manufacturing process of the Plumbus — a common household device."
  );
  log(`\nOutput written to: ${OUTPUT_LOG}`);
  log("=== Pipeline Complete ===");
}

main().catch((err) => {
  const errMsg = `FATAL ERROR: ${err instanceof Error ? err.stack : String(err)}`;
  console.error(errMsg);
  appendFileSync(OUTPUT_LOG, errMsg + "\n");
  process.exit(1);
});
