#! /bin/bash
set -eu

if [ "${LGTM_INDEX_BUILD_COMMAND:-}" = "" ]; then
  LGTM_INDEX_BUILD_COMMAND="${LGTM_BUILDTOOLS}/cpp/do-build"
fi

if [ -x /opt/deptrace/deptrace ]; then
  /opt/deptrace/deptrace \
    "${SEMMLE_DIST}/tools/odasa" index \
    --compilers "${LGTM_BUILDTOOLS}/cpp/c-compiler-settings" \
    "${LGTM_INDEX_BUILD_COMMAND}"
else
  "${SEMMLE_DIST}/tools/odasa" index \
    --compilers "${LGTM_BUILDTOOLS}/cpp/c-compiler-settings" \
    "${LGTM_INDEX_BUILD_COMMAND}"
fi

# Produce a trap file to capture the mapping from headers to packages.
"${LGTM_BUILDTOOLS}/cpp/header_packages.py"
