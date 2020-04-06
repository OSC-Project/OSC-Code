import os
import sys
import subprocess

download_script = "src_internalDB.py"
db_file = "cwe94.json"

analysis_script = os.path.join("syntax-search", "syntaxSearchTool_V2.js")
analysis_target = os.path.join(os.getcwd(), "new_package_src")

if __name__ == "__main__":
    download_command = "python " + download_script + " " + db_file
    download_output = subprocess.Popen(download_command, stderr=subprocess.STDOUT, shell=True)
    while download_output.poll() is None:
        if not download_output.stdout: continue
        line = download_output.stdout.readline()
        if not line: continue
        print(line)

    analysis_command = "node " + analysis_script + " \"" + analysis_target + "\""
    analysis_output = subprocess.Popen(analysis_command, stderr=subprocess.STDOUT, shell=True)
    while analysis_output.poll() is None:
        if not analysis_output.stdout: continue
        line = analysis_output.stdout.readline()
        if not line: break
        print(line)
