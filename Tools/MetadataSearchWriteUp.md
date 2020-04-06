# Metadata Search {-}

## Description
This type of tool attempts to keep Node.js and other projects free of known vulnerabilities in its dependencies by collecting a list of the open-source dependencies through the dependency list, and scraping known issues/vulnerabilities from repos where that package is hosted.

## Limitations
Because they are limited to open source packages, the majority of these services cannot scan user-created code for vulnerabilities, as the system relies on ones already found by the internet, or by a member of their own private team. These services are also unable to procedurally detect any vulnerabilities, only able to flag ones found manually.

## List of tools

### Snyk <img src="https://res.cloudinary.com/snyk/image/upload/v1533761770/logo-1_wtob68.svg" height="100"/>
Snyk generally works as described above. Along with collecting known security issues with packages via the NIS, NVD, and NSP, Snyk also compiles its own database of issues, and will create patches for bugs the package developers haven't fixed.

### SourceClear (SRC:CLR) <img src="https://www.sourceclear.com/images/SourceClear_Logo_Primary_Black.png" height="60"/>

This tool is similar to Snyk, however SourceClear is able to do some scanning of user code to check for use of known vulnerable methods from dependencies. This feature is only available in paid versions.

> Premium users can view the actual vulnerable part of the library. Even if a vulnerable library is in use, SourceClear can identify if a vulnerable method is in use. If the specific vulnerable method in not in use, the project might not be subject to a potential exploit. **_-SourceClear FAQ_**
