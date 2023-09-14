import os
from pathlib import Path
# This script generates the missing files in the application directory from where the script is called.

# current directory
cwd = Path(os.getcwd())
files = ['urls', 'serializers']

for file in files:
    # Create the file
    file_root = f'{cwd}/{file}.py'
    with open(file_root, "w") as archivo:
        archivo.write(f"# File {file}\n")

    print(f"File created at {file_root}")