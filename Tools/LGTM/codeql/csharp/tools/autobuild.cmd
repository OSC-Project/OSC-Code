@echo off
SETLOCAL EnableDelayedExpansion

rem Some legacy environment variables for the autobuilder.
set LGTM_PROJECT_LANGUAGE=csharp

rem The autobuilder is already being traced
set CODEQL_AUTOBUILDER_CSHARP_NO_INDEXING=true

type NUL && "%CODEQL_EXTRACTOR_CSHARP_ROOT%/tools/%CODEQL_PLATFORM%/Semmle.Autobuild.exe" || exit /b %ERRORLEVEL%

ENDLOCAL
