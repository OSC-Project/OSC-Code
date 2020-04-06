# Source Code/Static Analysis Tools in Javascript

## Limitations

- Many types of security vulnerabilities are difficult to find automatically, such as authentication problems, access control issues, insecure use of cryptography, etc. The current tools are only able to automatically find a relatively small percentage of application security flaws.
- High numbers of false positives.
- Frequently can't find configuration issues, since they are not represented in the code.
- Difficult to 'prove' that an identified security issue is an actual vulnerability.
Many of these tools have difficulty analyzing code that can't be compiled. Analysts frequently can't compile code because they don't have the right libraries, all the compilation instructions, all the code, etc.


## Examples

### LGTM
A free static analysis service for open source projects, that automatically monitors commits to publicly accessible code.

### Codacy


### PT Application Inspector
Combines SAST, DAST, IAST, SCA, configuration analysis and other technologies, including unique abstract interpretation. Has capability to generate test queries (exploits) to verify detected vulnerabilities during SAST analysis.

### SecureAssist
Scans code for insecure coding and configurations automatically as an IDE plugin for Eclipse, IntelliJ, and Visual Studio etc.

### Snappytick
Only available for Windows.
