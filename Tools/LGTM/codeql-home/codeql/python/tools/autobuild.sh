#!/bin/sh

set -eu

# Legacy environment variables for the autobuild infrastructure.
LGTM_SRC="$(pwd)"
LGTM_WORKSPACE="$CODEQL_EXTRACTOR_PYTHON_SCRATCH_DIR"
SEMMLE_DIST="$CODEQL_EXTRACTOR_PYTHON_ROOT"
export LGTM_SRC
export LGTM_WORKSPACE
export SEMMLE_DIST

if ! which python >/dev/null; then
    echo "ERROR: 'python' not found, it should be available when running 'which python' in your shell"
    exit 1
fi

exec python "$CODEQL_EXTRACTOR_PYTHON_ROOT/tools/index.py"
