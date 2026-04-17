import os
import subprocess
import json
import pytest
import glob

PROJECT_DIR = "/home/user/ai-recruiter"
OUTPUT_FILE = "/home/user/ai-recruiter/output.json"

@pytest.fixture(scope="module", autouse=True)
def setup_and_run():
    # Install dependencies
    result = subprocess.run(["npm", "install"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"npm install failed: {result.stderr}"
    
    # Find the script (run.js, run.mjs, run.ts)
    script_files = glob.glob(os.path.join(PROJECT_DIR, "run.*"))
    assert len(script_files) > 0, "No run.js or run.ts script found in project directory."
    script_file = script_files[0]
    
    # Run the script
    if script_file.endswith(".ts"):
        result = subprocess.run(["npx", "tsx", os.path.basename(script_file)], cwd=PROJECT_DIR, capture_output=True, text=True)
    else:
        result = subprocess.run(["node", os.path.basename(script_file)], cwd=PROJECT_DIR, capture_output=True, text=True)
        
    assert result.returncode == 0, f"Script execution failed: {result.stderr}\nStdout: {result.stdout}"

def test_output_file_exists():
    assert os.path.isfile(OUTPUT_FILE), f"Output file not found at {OUTPUT_FILE}"

def test_output_json_structure():
    with open(OUTPUT_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            pytest.fail("output.json does not contain valid JSON.")
            
    assert isinstance(data, list), f"Expected output.json to contain a JSON array, got {type(data)}."
    assert len(data) == 2, f"Expected array of length 2, got {len(data)}."
    
    alice_result = data[0]
    bob_result = data[1]
    
    # The output from a workflow run is the `.result` object, which has the outputSchema
    # If the workflow branches, the result might look like { askAboutSpecialty: { question: "..." } }
    
    alice_str = json.dumps(alice_result).lower()
    bob_str = json.dumps(bob_result).lower()
    
    # Check if Alice's result indicates technical branch
    assert "specialty" in alice_str or "askaboutspecialty" in alice_str, \
        f"Expected first item to contain output from 'askAboutSpecialty' branch, got: {alice_result}"
        
    # Check if Bob's result indicates non-technical branch
    assert "role" in bob_str or "askaboutrole" in bob_str, \
        f"Expected second item to contain output from 'askAboutRole' branch, got: {bob_result}"
