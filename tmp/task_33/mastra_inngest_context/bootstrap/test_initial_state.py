import os
import shutil
import subprocess
import pytest
import json

PROJECT_DIR = "/home/user/app"

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_workflow_file_exists():
    workflow_path = os.path.join(PROJECT_DIR, "src", "workflow.ts")
    assert os.path.isfile(workflow_path), f"Workflow file {workflow_path} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json {package_json_path} does not exist."
    with open(package_json_path) as f:
        content = f.read()
    assert "test:workflow" in content, "Expected 'test:workflow' script in package.json."
