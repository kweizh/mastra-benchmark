import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/mastra-rag"
DB_FILE = os.path.join(PROJECT_DIR, "mastra.db")

def test_mastra_db_exists():
    """Priority 3 fallback: basic file existence check for the database."""
    assert os.path.isfile(DB_FILE), f"mastra.db not found at {DB_FILE}"

def test_rag_pipeline_execution():
    """Priority 1: Run a query script to verify the embeddings were stored correctly."""
    verify_script = os.path.join(PROJECT_DIR, "verify.ts")
    with open(verify_script, "w") as f:
        f.write('''
import { LibSQLVector } from "@mastra/libsql";
import { embedMany } from "ai";
import { ModelRouterEmbeddingModel } from "@mastra/core/llm";

async function main() {
  const store = new LibSQLVector({
    id: "libsql-vector",
    url: "file:mastra.db"
  });

  const { embeddings } = await embedMany({
    values: ["Mastra AI Framework"],
    model: new ModelRouterEmbeddingModel("openai/text-embedding-3-small"),
  });

  const queryVector = embeddings[0];
  const results = await store.query({
    indexName: "embeddings",
    queryVector,
    topK: 1,
  });

  console.log(JSON.stringify(results));
}

main().catch(console.error);
''')
    
    result = subprocess.run(
        ["npx", "tsx", "verify.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Verification script failed: {result.stderr}"
    
    try:
        data = json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        pytest.fail(f"Failed to parse JSON output: {result.stdout}")
        
    assert len(data) > 0, "No results returned from vector database query."
    assert "metadata" in data[0], "Result missing metadata field."
    assert "text" in data[0]["metadata"], "Result metadata missing text field."
    assert "Mastra" in data[0]["metadata"]["text"], f"Expected 'Mastra' in text, got: {data[0]['metadata']['text']}"
