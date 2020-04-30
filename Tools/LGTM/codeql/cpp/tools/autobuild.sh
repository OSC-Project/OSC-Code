#!/bin/sh

set -eu

if [ "$CODEQL_PLATFORM" != "linux64" ] ; then
    echo "Automatic build detection for $CODEQL_PLATFORM is not implemented."
    exit 1
fi

# Directory where the autobuild scripts live.
AUTOBUILD_ROOT="$CODEQL_EXTRACTOR_CPP_ROOT/tools/lgtm-scripts/cpp"

# The build scripts expect some legacy env vars to be set.
LGTM_BUILDTOOLS="$(dirname "${AUTOBUILD_ROOT}")"
export LGTM_BUILDTOOLS

"$AUTOBUILD_ROOT/do-prebuild"

"$AUTOBUILD_ROOT/do-build"