#!/usr/bin/env bash
set -euo pipefail

if [ -z "${PROSPEO_API_KEY:-}" ]; then
  echo "pluxx: PROSPEO_API_KEY is not set. Export it before using this plugin." >&2
  exit 1
fi

if [ ! -f "${PLUGIN_ROOT:-.}/build/index.js" ]; then
  echo "pluxx: build/index.js is missing. Run npm install && npm run build in the Prospeo repo before using this plugin." >&2
  exit 1
fi
