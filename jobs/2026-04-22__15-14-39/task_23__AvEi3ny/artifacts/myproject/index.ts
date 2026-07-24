import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import dotenv from 'dotenv';
import { MDocument } from '@mastra/rag';
import { ModelRouterEmbeddingModel } from '@mastra/core/llm';
import { MastraVector } from '@mastra/core/vector';
import type {
  CreateIndexParams,
  DeleteIndexParams,
  DeleteVectorParams,
  DeleteVectorsParams,
  DescribeIndexParams,
  IndexStats,
  QueryResult,
  QueryVectorParams,
  UpdateVectorParams,
  UpsertVectorParams,
} from '@mastra/core/vector';

dotenv.config();

type StoredVector = {
  id: string;
  vector: number[];
  metadata?: Record<string, any>;
};

type IndexData = {
  dimension: number;
  metric: 'cosine' | 'euclidean' | 'dotproduct';
  vectors: StoredVector[];
};

class InMemoryVectorStore extends MastraVector {
  private indexes = new Map<string, IndexData>();

  constructor(id = 'local-memory') {
    super({ id });
  }

  async createIndex({ indexName, dimension, metric = 'cosine' }: CreateIndexParams): Promise<void> {
    this.indexes.set(indexName, { dimension, metric, vectors: [] });
  }

  async listIndexes(): Promise<string[]> {
    return Array.from(this.indexes.keys());
  }

  async describeIndex({ indexName }: DescribeIndexParams): Promise<IndexStats> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    return { dimension: index.dimension, count: index.vectors.length, metric: index.metric };
  }

  async deleteIndex({ indexName }: DeleteIndexParams): Promise<void> {
    this.indexes.delete(indexName);
  }

  async upsert({ indexName, vectors, metadata, ids }: UpsertVectorParams): Promise<string[]> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    const assignedIds = vectors.map((_, idx) => ids?.[idx] ?? `vec_${index.vectors.length + idx}`);
    const newVectors: StoredVector[] = vectors.map((vector, idx) => ({
      id: assignedIds[idx],
      vector,
      metadata: metadata?.[idx],
    }));
    index.vectors.push(...newVectors);
    return assignedIds;
  }

  async query({ indexName, queryVector, topK = 5, includeVector }: QueryVectorParams): Promise<QueryResult[]> {
    if (!queryVector) {
      throw new Error('queryVector is required for in-memory search');
    }
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    const scored = index.vectors.map((item) => ({
      item,
      score: cosineSimilarity(queryVector, item.vector),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).map(({ item, score }) => ({
      id: item.id,
      score,
      metadata: item.metadata,
      vector: includeVector ? item.vector : undefined,
    }));
  }

  async updateVector(params: UpdateVectorParams): Promise<void> {
    const index = this.indexes.get(params.indexName);
    if (!index) {
      throw new Error(`Index ${params.indexName} not found`);
    }
    if ('id' in params) {
      const target = index.vectors.find((vector) => vector.id === params.id);
      if (!target) {
        return;
      }
      if (params.update.vector) {
        target.vector = params.update.vector;
      }
      if (params.update.metadata) {
        target.metadata = { ...target.metadata, ...params.update.metadata };
      }
    }
  }

  async deleteVector({ indexName, id }: DeleteVectorParams): Promise<void> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    index.vectors = index.vectors.filter((vector) => vector.id !== id);
  }

  async deleteVectors({ indexName, ids }: DeleteVectorsParams): Promise<void> {
    const index = this.indexes.get(indexName);
    if (!index) {
      throw new Error(`Index ${indexName} not found`);
    }
    if (!ids?.length) {
      return;
    }
    const idSet = new Set(ids);
    index.vectors = index.vectors.filter((vector) => !idSet.has(vector.id));
  }
}

const cosineSimilarity = (a: number[], b: number[]): number => {
  const dot = a.reduce((sum, value, idx) => sum + value * (b[idx] ?? 0), 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));
  return magnitudeA && magnitudeB ? dot / (magnitudeA * magnitudeB) : 0;
};

const main = async () => {
  const projectRoot = '/home/user/myproject';
  const inputPath = path.join(projectRoot, 'data.md');
  const outputPath = path.join(projectRoot, 'output.log');
  const question = 'What is the main topic of the document?';

  const markdown = await readFile(inputPath, 'utf-8');
  const document = MDocument.fromMarkdown(markdown, { source: inputPath });

  const chunks = await document.chunk({
    strategy: 'markdown',
    maxSize: 1200,
    overlap: 200,
  });

  const texts = chunks.map((chunk) => chunk.text);
  const embedder = new ModelRouterEmbeddingModel('openai/text-embedding-3-small');
  const embeddedChunks = await embedder.doEmbed({ values: texts });

  const vectorStore = new InMemoryVectorStore();
  const dimension = embeddedChunks.embeddings[0]?.length ?? 0;
  const indexName = 'markdown_chunks';

  await vectorStore.createIndex({
    indexName,
    dimension,
    metric: 'cosine',
  });

  await vectorStore.upsert({
    indexName,
    vectors: embeddedChunks.embeddings,
    metadata: chunks.map((chunk, index) => ({
      chunkIndex: index,
      text: chunk.text,
      metadata: chunk.metadata,
    })),
  });

  const queryEmbedding = await embedder.doEmbed({ values: [question] });
  const results = await vectorStore.query({
    indexName,
    queryVector: queryEmbedding.embeddings[0],
    topK: 3,
  });

  const outputLines = [
    `Question: ${question}`,
    '',
    'Top matches:',
    ...results.map((result, idx) => {
      const text = result.metadata?.text ?? '';
      return `${idx + 1}. (score: ${result.score.toFixed(4)}) ${text.replace(/\s+/g, ' ').trim()}`;
    }),
    '',
  ];

  await writeFile(outputPath, outputLines.join('\n'), 'utf-8');
  console.log(outputLines.join('\n'));
};

main().catch((error) => {
  console.error('RAG pipeline failed:', error);
  process.exit(1);
});
