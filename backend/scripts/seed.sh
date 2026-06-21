#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PB_DIR="$ROOT_DIR/pocketbase"

mkdir -p "$PB_DIR/pb_data"

echo "Applying the MVP schema..."
"$PB_DIR/pocketbase" migrate up \
  --dir="$PB_DIR/pb_data" \
  --migrationsDir="$PB_DIR/pb_migrations"

echo "Creating demo records..."
"$PB_DIR/pocketbase" migrate up \
  --dir="$PB_DIR/pb_data" \
  --migrationsDir="$PB_DIR/seed_migrations"

echo "Demo data is ready. Do not run this while PocketBase is serving the same data directory."

