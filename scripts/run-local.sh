#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit 1
echo "Started on http://localhost:8000"
python3 -m http.server 8000