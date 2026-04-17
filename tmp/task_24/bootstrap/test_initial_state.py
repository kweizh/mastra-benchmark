import os
import shutil
import pytest
import json

PROJECT_DIR = "/home/user/project"

def test_node_binary_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"File {package_json_path} does not exist."

def test_dependencies_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path) as f:
        data = json.load(f)
    
    dependencies = data.get("dependencies", {})
    assert "@mastra/core" in dependencies, "Expected '@mastra/core' to be in package.json dependencies."
    assert "zod" in dependencies, "Expected 'zod' to be in package.json dependencies."
