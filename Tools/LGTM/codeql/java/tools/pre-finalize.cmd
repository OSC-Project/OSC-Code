@echo off
SETLOCAL EnableDelayedExpansion

type NUL && "%CODEQL_DIST%\codeql" database index-files ^
    --include "**/AndroidManifest.xml" ^
    --include "**/pom.xml" ^
    --size-limit 10m ^
    --language xml ^
    -- ^
    "%CODEQL_EXTRACTOR_JAVA_WIP_DATABASE%"

ENDLOCAL
