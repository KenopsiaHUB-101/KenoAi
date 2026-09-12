#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${REPO_DIR:-/workspaces/KenoAi/ai-website}"
BUILD_DIR="${BUILD_DIR:-/workspace/build-temp}"

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Build sandbox not found: $BUILD_DIR" >&2
  echo "Create it with x86 dependencies before running this script." >&2
  exit 1
fi

if [[ ! -f "$BUILD_DIR/.env" ]] || ! grep -q '^VITE_GOOGLE_CLIENT_ID=' "$BUILD_DIR/.env"; then
  echo "Missing VITE_GOOGLE_CLIENT_ID in $BUILD_DIR/.env" >&2
  exit 1
fi

rm -rf "$BUILD_DIR/src" "$BUILD_DIR/dist" "$BUILD_DIR/public"
cp -r "$REPO_DIR/src" "$BUILD_DIR/"
cp -r "$REPO_DIR/public" "$BUILD_DIR/"
cp "$REPO_DIR/index.html" "$REPO_DIR/package.json" "$BUILD_DIR/"

cd "$BUILD_DIR"
npm run build
rm -rf "$REPO_DIR/dist"
cp -r "$BUILD_DIR/dist" "$REPO_DIR/dist"
printf 'Production build copied to %s/dist\n' "$REPO_DIR"
