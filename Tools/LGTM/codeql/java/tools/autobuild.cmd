@echo off
SETLOCAL EnableDelayedExpansion

type NUL && "%CODEQL_JAVA_HOME%\bin\java.exe" ^
    -cp "%CODEQL_EXTRACTOR_JAVA_ROOT%\tools\autobuild-fat.jar" ^
    com.semmle.autobuild.standalone.AutoBuild --no-indexing ^
    --expand-var-override semmle_dist "%CODEQL_DIST%" ^
    --maven-local-repo-options MACHINE_DEFAULT || exit /b %ERRORLEVEL%

ENDLOCAL
