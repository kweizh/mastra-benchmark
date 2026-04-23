import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import 'dotenv/config';
import OpenAI from 'openai';

// Mastra RAG imports
import { MDocument } from '@mastra/rag';
import { LibSQLVector } from '@mastra/libsql';

async function main() {
  console.log('Starting RAG Pipeline...');
  
  // Read the markdown file
  const dataPath = join(__dirname, 'data.md');
  console.log(`Reading data from: ${dataPath}`);
  const markdownContent = readFileSync(dataPath, 'utf-8');
  
  // Create OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });
  
  // Create vector store (using LibSQL for local storage)
  const vectorStore = new LibSQLVector({
    id: 'rag_vector_store',
    url: 'file:./vector.db',
  });
  
  // Create a document from markdown
  console.log('Creating document from markdown...');
  const doc = MDocument.fromMarkdown(markdownContent, {
    source: 'data.md',
  });
  
  // Chunk the document using recursive strategy
  console.log('Chunking document...');
  await doc.chunk({
    strategy: 'recursive',
    maxSize: 500,
    overlap: 50,
  });
  
  const chunks = doc.getDocs();
  console.log(`Created ${chunks.length} chunks`);
  
  // Generate embeddings for the chunks
  console.log('Generating embeddings...');
  const chunkTexts = chunks.map(chunk => chunk.text);
  
  const embeddings: number[][] = [];
  const batchSize = 100; // OpenAI allows up to 2048 embeddings per request
  
  for (let i = 0; i < chunkTexts.length; i += batchSize) {
    const batch = chunkTexts.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunkTexts.length / batchSize)}`);
    
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: batch,
    });
    
    for (const item of response.data) {
      embeddings.push(item.embedding);
    }
  }
  
  console.log(`Generated ${embeddings.length} embeddings`);
  console.log(`Embedding dimension: ${embeddings[0]?.length || 'unknown'}`);
  
  // Create index
  const indexName = 'rag_index';
  const dimension = embeddings[0]?.length || 1536;
  
  // Check if index exists, if not create it
  try {
    const indexes = await vectorStore.listIndexes();
    if (!indexes.includes(indexName)) {
      console.log(`Creating index: ${indexName}`);
      await vectorStore.createIndex({
        indexName,
        dimension,
        metric: 'cosine',
      });
    } else {
      console.log(`Index ${indexName} already exists`);
    }
  } catch (error: any) {
    console.log(`Error checking/creating index: ${error.message}`);
    // Try to create index anyway
    try {
      await vectorStore.createIndex({
        indexName,
        dimension,
        metric: 'cosine',
      });
    } catch (createError: any) {
      console.log(`Index may already exist: ${createError.message}`);
    }
  }
  
  // Store embeddings in vector database
  console.log('Storing embeddings in vector database...');
  const ids = await vectorStore.upsert({
    indexName,
    vectors: embeddings,
    metadata: chunks.map((chunk, index) => ({
      text: chunk.text,
      source: 'data.md',
      chunkIndex: index,
    })),
  });
  
  console.log(`Stored ${ids.length} embeddings`);
  
  // Query with the specific question
  const query = 'What is the main topic of the document?';
  console.log(`Querying with: "${query}"`);
  
  // Generate embedding for the query
  const queryResponse = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: [query],
  });
  
  const queryEmbedding = queryResponse.data[0].embedding;
  
  const results = await vectorStore.query({
    indexName,
    queryVector: queryEmbedding,
    topK: 3,
  });
  
  console.log(`Retrieved ${results.length} results`);
  
  // Prepare output
  let output = '=== RAG Pipeline Results ===\n\n';
  output += `Query: "${query}"\n\n`;
  output += `Retrieved ${results.length} chunks:\n\n`;
  
  results.forEach((result, index) => {
    output += `--- Chunk ${index + 1} ---\n`;
    output += `ID: ${result.id}\n`;
    output += `Score: ${result.score.toFixed(4)}\n`;
    output += `Content: ${result.metadata?.text || 'N/A'}\n`;
    output += `Metadata: ${JSON.stringify(result.metadata)}\n\n`;
  });
  
  // Write output to log file
  const outputPath = join(__dirname, 'output.log');
  writeFileSync(outputPath, output, 'utf-8');
  
  console.log(`Results written to: ${outputPath}`);
  console.log('\n=== Output Content ===');
  console.log(output);
}

main().catch(console.error);
