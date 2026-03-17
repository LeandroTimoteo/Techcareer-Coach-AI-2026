import subprocess
import os

def run_git_cmd(cmd):
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=r"c:\Users\leand\OneDrive\Ambiente de Trabalho\Projetos 2025\techcareer-coach-ai")
        return f"Command: {cmd}\nSTDOUT: {result.stdout}\nSTDERR: {result.stderr}\nCode: {result.returncode}\n"
    except Exception as e:
        return f"Error running {cmd}: {str(e)}\n"

output = ""
output += run_git_cmd("git branch --show-current")
output += run_git_cmd("git status")
output += run_git_cmd("git log -n 1 --oneline")

with open(r"c:\Users\leand\OneDrive\Ambiente de Trabalho\Projetos 2025\techcareer-coach-ai\git_results.txt", "w") as f:
    f.write(output)
