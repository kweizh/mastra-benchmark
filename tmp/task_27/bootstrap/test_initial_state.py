import os
import shutil
import pytest

APP_DIR = "/home/user/app"
DATA_DIR = "/home/user/data"

def test_node_installed():
    assert shutil.which("node") is not None, "Node.js is not installed."
    assert shutil.which("npm") is not None, "npm is not installed."

def test_app_directory_exists():
    assert os.path.isdir(APP_DIR), f"App directory {APP_DIR} does not exist."

def test_data_directory_exists():
    assert os.path.isdir(DATA_DIR), f"Data directory {DATA_DIR} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(APP_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"Expected package.json in {APP_DIR}."