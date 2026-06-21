#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PB_DIR="$ROOT_DIR/pocketbase"

mkdir -p "$PB_DIR/pb_data" "$PB_DIR/pb_migrations"
cd "$PB_DIR"

exec "$PB_DIR/pocketbase" serve \
  --http=127.0.0.1:8090 \
  --dir="$PB_DIR/pb_data" \
  --migrationsDir="$PB_DIR/pb_migrations"

