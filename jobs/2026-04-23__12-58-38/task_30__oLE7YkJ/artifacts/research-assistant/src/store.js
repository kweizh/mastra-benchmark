import { readFileSync } from 'fs';
import { LibSQLVector } from '@mastra/libsql';
import { MDocument } from '@mastra/rag';
import OpenAI from 'openai';

// Initialize OpenAI for embeddings
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Initialize LibSQLVector database
const libSqlVector = new LibSQLVector({
  id: 'libsql-vector-store',
  url: 'file:/home/user/research-assistant/vector.db',
});

async function storePaper() {
  console.log('Reading paper from /home/user/paper.md...');
  
  // Read the paper content
  const paperContent = readFileSync('/home/user/paper.md', 'utf-8');
  
  console.log('Creating document and chunking...');
  
  // Create document and chunk it
  const doc = MDocument.fromText(paperContent);
  
  // Chunk the document using recursive strategy
  await doc.chunkRecursive({
    maxSize: 512,
    overlap: 50,
  });
  
  // Get chunks
  const chunks = doc.getDocs();
  
  console.log(`Generated ${chunks.length} chunks`);
  
  // Generate embeddings for each chunk
  const vectors = [];
  const ids = [];
  const metadata = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    console.log(`Generating embedding for chunk ${i + 1}/${chunks.length}...`);
    
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.text,
    });
    
    const embedding = embeddingResponse.data[0].embedding;
    
    vectors.push(embedding);
    ids.push(`chunk-${i}`);
    metadata.push({
      text: chunk.text,
      chunkIndex: i,
    });
  }
  
  console.log('Creating vector index...');
  
  // Create the index first (text-embedding-3-small has dimension 1536)
  await libSqlVector.createIndex({
    indexName: 'papers',
    dimension: 1536,
    metric: 'cosine',
  });
  
  console.log('Upserting embeddings to vector database...');
  
  // Upsert embeddings to the 'papers' index
  await libSqlVector.upsert({
    indexName: 'papers',
    vectors,
    ids,
    metadata,
  });
  
  console.log('Successfully stored embeddings in vector database!');
  console.log(`Total chunks stored: ${vectors.length}`);
}

storePaper().catch(console.error);