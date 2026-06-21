#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DATA_DIR="$ROOT_DIR/pocketbase/pb_data"

read -r -p "Delete all local PocketBase data? [y/N] " answer
if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
  echo "Reset cancelled."
  exit 0
fi

rm -rf "$DATA_DIR"
mkdir -p "$DATA_DIR"
echo "Local PocketBase data removed. Run ./scripts/start.sh to recreate the schema."

