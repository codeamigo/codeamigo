#!/bin/bash
set -e pipefail

VENV_NAME=".venv/ml-service"

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check the version of Python installed
python_version=$(python3 -c 'import platform; print(platform.python_version())')
if [[ "$python_version" < "3.9" ]]
then
    echo "Error: Python version is less than 3.9"
    exit 1
fi

# Check if virtual environment already exists
if [ -d "$VENV_NAME" ]; then
    echo "Activating existing virtual environment '$VENV_NAME'..."
    source "$VENV_NAME/bin/activate"
else
    echo "Creating new virtual environment '$VENV_NAME'..."
    python3 -m venv "$VENV_NAME"
    source "$VENV_NAME/bin/activate"
fi

pip3 install --upgrade pip && pip3 install -r requirements.txt
