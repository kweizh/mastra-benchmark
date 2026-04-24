import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"
INDEX_FILE = os.path.join(PROJECT_DIR, "index.ts")

def test_index_file_exists():
    assert os.path.isfile(INDEX_FILE), f"index.ts not found at {INDEX_FILE}"

def test_weather_tool_execution():
    test_script_path = os.path.join(PROJECT_DIR, "test_tool.ts")
    test_script_content = """
import { weatherTool } from './index.ts';

async function run() {
    try {
        const result = await weatherTool.execute({
            location: "London"
        });
        console.log(JSON.stringify(result));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
"""
    with open(test_script_path, "w") as f:
        f.write(test_script_content)
    
    result = subprocess.run(
        ["npx", "tsx", "test_tool.ts"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    
    assert result.returncode == 0, f"Test script execution failed: {result.stderr}"
    
    output = result.stdout.strip()
    assert "The weather in London is sunny." in output, f"Expected weather string in output, but got: {output}"
