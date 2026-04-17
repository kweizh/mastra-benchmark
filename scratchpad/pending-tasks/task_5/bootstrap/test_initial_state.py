import os
import shutil
import pytest

PROJECT_DIR = "/home/user/mastra-rag"

def test_node_binary_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_data_md_exists():
    data_path = os.path.join(PROJECT_DIR, "data.md")
    assert os.path.isfile(data_path), f"data.md not found at {data_path}."
