import os
import shutil
import pytest

PROJECT_DIR = "/home/user/myproject"

def test_node_and_npm_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_data_file_exists():
    data_path = os.path.join(PROJECT_DIR, "data.md")
    assert os.path.isfile(data_path), f"Data file {data_path} does not exist."
