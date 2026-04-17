import os
import subprocess
import glob
import pytest

PROJECT_DIR = "/home/user/app"

def test_patch_file_exists():
    """Priority 3 fallback: check if the patch file was generated."""
    patch_dir = os.path.join(PROJECT_DIR, "patches")
    assert os.path.isdir(patch_dir), f"Patches directory {patch_dir} does not exist. Did you run patch-package?"
    
    patch_files = glob.glob(os.path.join(patch_dir, "@mastra+inngest+*.patch"))
    assert len(patch_files) > 0, "No patch file for @mastra/inngest found in the patches directory."

def test_workflow_runs_successfully():
    """Priority 1: Run the workflow and verify the output."""
    result = subprocess.run(
        ["npm", "run", "test:workflow"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Workflow test failed with error:\n{result.stderr}\n{result.stdout}"
    assert "Success! Context persisted." in result.stdout, f"Expected success message in output, but got:\n{result.stdout}"
