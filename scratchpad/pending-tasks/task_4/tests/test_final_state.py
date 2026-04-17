import os
import json
import subprocess
import pytest

PROJECT_DIR = "/home/user/app"
OUTPUT_FILE = os.path.join(PROJECT_DIR, "output.json")

def test_output_json_exists_and_correct():
    """Priority 3: Check if the output.json exists and has the correct message."""
    assert os.path.isfile(OUTPUT_FILE), f"Output file not found at {OUTPUT_FILE}"
    
    with open(OUTPUT_FILE, "r") as f:
        data = json.load(f)
        
    expected_message = "Content was approved with score 59"
    actual_message = data.get("message")
    
    assert actual_message == expected_message, \
        f"Expected message '{expected_message}', but got: '{actual_message}'"

def test_workflow_rejection_branch():
    """Priority 1: Run the exported workflow with a short string to test the rejection branch."""
    test_script_path = os.path.join(PROJECT_DIR, "test_workflow.ts")
    test_script_content = """
import { contentWorkflow } from './workflow';
import * as fs from 'fs';

async function runTest() {
  const run = await contentWorkflow.createRun();
  const result = await run.start({ inputData: { content: 'Short' } });
  if (result.status === 'success') {
    fs.writeFileSync('test_output.json', JSON.stringify(result.result));
  } else {
    console.error('Workflow failed');
    process.exit(1);
  }
}

runTest();
"""
    with open(test_script_path, "w") as f:
        f.write(test_script_content)
        
    result = subprocess.run(
        ["npx", "tsx", "test_workflow.ts"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Failed to run test_workflow.ts: {result.stderr}"
    
    test_output_path = os.path.join(PROJECT_DIR, "test_output.json")
    assert os.path.isfile(test_output_path), "test_output.json was not created by the workflow"
    
    with open(test_output_path, "r") as f:
        data = json.load(f)
        
    expected_message = "Content was rejected with score 5"
    actual_message = data.get("message")
    
    assert actual_message == expected_message, \
        f"Expected message '{expected_message}', but got: '{actual_message}'"
