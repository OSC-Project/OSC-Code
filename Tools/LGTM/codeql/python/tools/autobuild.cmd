@echo off
SETLOCAL EnableDelayedExpansion

rem Legacy environment variables for the autobuild infrastructure.
set LGTM_SRC=%CD%
set LGTM_WORKSPACE=%CODEQL_EXTRACTOR_PYTHON_SCRATCH_DIR%
set SEMMLE_DIST=%CODEQL_EXTRACTOR_PYTHON_ROOT%

type NUL && python %CODEQL_EXTRACTOR_PYTHON_ROOT%\tools\index.py
exit /b %ERRORLEVEL%

ENDLOCAL
