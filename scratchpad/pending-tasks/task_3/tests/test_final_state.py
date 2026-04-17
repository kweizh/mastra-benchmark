import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"
AGENT_FILE = os.path.join(PROJECT_DIR, "agent.ts")

def test_agent_file_exists():
    assert os.path.isfile(AGENT_FILE), f"agent.ts not found at {AGENT_FILE}"

def test_calculator_tool_and_agent_functionality():
    """Verify the tool and agent exports using a tsx script."""
    
    test_script_path = os.path.join(PROJECT_DIR, "verify_agent.ts")
    test_script_content = """
import { calculatorTool, mathAgent } from './agent';

async function verify() {
    let results = { tool_sum: null, agent_id: null, agent_tools: [] };
    
    // Check tool
    try {
        const result = await calculatorTool.execute({ context: {}, suspend: () => {}, runId: "test", stepId: "test", inputData: { a: 5, b: 7 } });
        results.tool_sum = result.sum;
    } catch (e) {
        // ignore
    }
    
    // Check agent
    try {
        if (mathAgent.name) results.agent_id = mathAgent.name;
        if (mathAgent.id) results.agent_id = mathAgent.id;
    } catch (e) {
        // ignore
    }
    
    console.log(JSON.stringify(results));
}

verify().catch(e => console.error(e));
"""
    
    with open(test_script_path, "w") as f:
        f.write(test_script_content)
        
    result = subprocess.run(
        ["npx", "tsx", "verify_agent.ts"],
        cwd=PROJECT_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    assert result.returncode == 0, f"Failed to run verify script: {result.stderr}\\n{result.stdout}"
    
    try:
        output = json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        pytest.fail(f"Failed to parse output as JSON: {result.stdout}\\n{result.stderr}")
        
    assert output.get("tool_sum") == 12, f"Expected tool to return sum 12, got: {output.get('tool_sum')}"
    
    agent_id = output.get("agent_id")
    assert agent_id == "math-agent", f"Expected agent id to be 'math-agent', got: {agent_id}"
