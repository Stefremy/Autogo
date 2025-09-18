#!/usr/bin/env bash
set -euo pipefail

# Creates a timestamped zip of the workspace root excluding large or transient folders
# Usage: ./scripts/export_workspace.sh [output-name]

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_NAME=${1:-"autogo_export_$(date +%Y%m%d_%H%M%S).zip"}
OUT_PATH="$ROOT_DIR/$OUT_NAME"

echo "Creating export at: $OUT_PATH"

# Ensure zip exists
if ! command -v zip >/dev/null 2>&1; then
  echo "zip not found. Trying to use python's zipfile (needs python3)."
  if command -v python3 >/dev/null 2>&1; then
    PYTHON=python3
  else
    echo "Neither zip nor python3 found. Please install zip or python3." >&2
    exit 1
  fi
fi

# Files/folders to exclude
EXCLUDES=(
  "node_modules/*"
  ".next/*"
  "dist/*"
  "build/*"
  "**/.git/*"
  "**/venv/*"
  "**/__pycache__/*"
  "**/npm-debug.log"
  "**/yarn-error.log"
)

if command -v zip >/dev/null 2>&1; then
  # Build exclude args
  EX_ARGS=()
  for e in "${EXCLUDES[@]}"; do
    EX_ARGS+=( -x "$e" )
  done

  (cd "$ROOT_DIR" && zip -r "$OUT_PATH" . "${EX_ARGS[@]}")
else
  # Fallback to python zip creation
  echo "Creating zip with python..."
  $PYTHON - <<PYCODE
import os, zipfile, fnmatch
root = ${repr(ROOT_DIR)}
out = ${repr(OUT_PATH)}
excludes = ${repr(EXCLUDES)}
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for base, dirs, files in os.walk(root):
        # compute relative path
        rel = os.path.relpath(base, root)
        if rel == '.':
            rel = ''
        skip_dir = False
        for pat in excludes:
            if fnmatch.fnmatch(os.path.join(rel, ''), pat):
                skip_dir = True
                break
        if skip_dir:
            continue
        for f in files:
            fp = os.path.join(base, f)
            rp = os.path.join(rel, f) if rel else f
            skip_file = any(fnmatch.fnmatch(rp, pat) for pat in excludes)
            if skip_file:
                continue
            z.write(fp, rp)
print('Wrote', out)
PYCODE
fi

echo "Export created: $OUT_PATH"

echo "Next steps:"
echo "  - Download the file using SCP: scp user@host:$OUT_PATH ./"
echo "  - Or start a simple HTTP server and download from your browser:"
echo "      cd $ROOT_DIR && python3 -m http.server 8000"
echo "    then open http://localhost:8000/$OUT_NAME in your browser or use port forwarding to access from your machine."

exit 0
