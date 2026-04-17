import os
import json
import subprocess
import pytest

PROJECT_DIR = "/home/user/mastra-app"

def test_package_json_dependencies():
    """Priority 3: Verify package.json contains @mastra/core."""
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json not found at {package_json_path}"
    
    with open(package_json_path) as f:
        data = json.load(f)
        
    dependencies = data.get("dependencies", {})
    assert "@mastra/core" in dependencies, f"Expected @mastra/core in dependencies, got {list(dependencies.keys())}"

def test_package_json_scripts():
    """Priority 3: Verify package.json contains dev and build scripts for mastra."""
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json not found at {package_json_path}"
    
    with open(package_json_path) as f:
        data = json.load(f)
        
    scripts = data.get("scripts", {})
    assert scripts.get("dev") == "mastra dev", f"Expected 'dev': 'mastra dev', got {scripts.get('dev')}"
    assert scripts.get("build") == "mastra build", f"Expected 'build': 'mastra build', got {scripts.get('build')}"

def test_env_file_exists():
    """Priority 3: Verify .env exists and contains OPENAI_API_KEY=sk-dummy."""
    env_path = os.path.join(PROJECT_DIR, ".env")
    assert os.path.isfile(env_path), f".env file not found at {env_path}"
    
    with open(env_path) as f:
        content = f.read()
    
    assert "OPENAI_API_KEY=sk-dummy" in content, f"Expected OPENAI_API_KEY=sk-dummy in .env, got {content}"

def test_npm_run_build():
    """Priority 1: Run npm run build and ensure it succeeds."""
    result = subprocess.run(
        ["npm", "run", "build"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npm run build' failed: {result.stderr or result.stdout}"
