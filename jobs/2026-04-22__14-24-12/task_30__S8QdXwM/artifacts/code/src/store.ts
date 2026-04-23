import { MDocument } from '@mastra/rag';
import { LibSQLVector } from '@mastra/libsql';
import { openai } from '@ai-sdk/openai';
import { embedMany } from 'ai';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  // Read the paper
  const paperPath = '/home/user/paper.md';
  const paperContent = fs.readFileSync(paperPath, 'utf-8');
  console.log('Read paper, length:', paperContent.length);

  // Create MDocument from text and chunk it
  const doc = MDocument.fromText(paperContent);
  await doc.chunkBy('recursive', { maxSize: 512, overlap: 50 });
  const chunks = doc.getDocs();
  console.log('Chunks created:', chunks.length);
  chunks.forEach((c, i) => console.log(`Chunk ${i}: "${c.text.slice(0, 80)}..."`));

  // Generate embeddings using openai text-embedding-3-small
  const embeddingModel = openai.embedding('text-embedding-3-small');
  const texts = chunks.map(c => c.text);

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: texts,
  });
  console.log('Embeddings generated:', embeddings.length, 'dimensions:', embeddings[0].length);

  // Initialize LibSQLVector store
  const vectorStore = new LibSQLVector({
    url: 'file:/home/user/research-assistant/vector.db',
    id: 'libSqlVector',
  });

  // Create index (dimension 1536 for text-embedding-3-small)
  const dimension = embeddings[0].length;
  console.log('Creating index "papers" with dimension:', dimension);
  await vectorStore.createIndex({ indexName: 'papers', dimension });

  // Upsert embeddings with metadata
  const metadata = chunks.map((c, i) => ({
    text: c.text,
    chunkIndex: i,
    source: 'paper.md',
  }));

  await vectorStore.upsert({
    indexName: 'papers',
    vectors: embeddings,
    metadata,
  });

  console.log('Successfully upserted', embeddings.length, 'embeddings into "papers" index.');
}

main().catch(console.error);
