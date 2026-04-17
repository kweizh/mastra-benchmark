import os
import pytest

PROJECT_DIR = "/home/user/research-assistant"
PAPER_FILE = "/home/user/paper.md"

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_paper_file_exists():
    assert os.path.isfile(PAPER_FILE), f"Paper file {PAPER_FILE} does not exist."
