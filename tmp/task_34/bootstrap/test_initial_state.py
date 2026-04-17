import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/monorepo"

def test_pnpm_binary_available():
    assert shutil.which("pnpm") is not None, "pnpm binary not found in PATH."

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_workspace_yaml_exists():
    workspace_path = os.path.join(PROJECT_DIR, "pnpm-workspace.yaml")
    assert os.path.isfile(workspace_path), f"Workspace file {workspace_path} does not exist."

def test_mastra_package_exists():
    mastra_dir = os.path.join(PROJECT_DIR, "packages", "mastra-setup")
    assert os.path.isdir(mastra_dir), f"Mastra package directory {mastra_dir} does not exist."
    
def test_mastra_package_json_exists():
    pkg_json = os.path.join(PROJECT_DIR, "packages", "mastra-setup", "package.json")
    assert os.path.isfile(pkg_json), f"package.json in mastra-setup does not exist."

def test_mastra_tsconfig_exists():
    tsconfig = os.path.join(PROJECT_DIR, "packages", "mastra-setup", "tsconfig.json")
    assert os.path.isfile(tsconfig), f"tsconfig.json in mastra-setup does not exist."
