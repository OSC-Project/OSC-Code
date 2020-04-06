# JS structural analysis {-}

# graspJS
Located at [graspJS.com](https://www.graspjs.com/)

## Description
Type: General AST

Searches the abstract syntax tree of a javascript program. 

## Installation
Use `npm install -g grasp` to install graspJS

## Documentation and resources

### Reference Documentation
Available at the project's [website](https://www.graspjs.com/docs/).
- 

## Usage
Can be used from the command line or within JS to search for certain statements.

## Example 
`need to work on`

## Notes

# esprima
http://esprima.org/

## Description  
Type: General AST

Similar to graspJS but with a heavier focus on generating the AST. 

## Installation 
`npm install esprima`

## Documentation and resources
http://esprima.org/doc/index.html

## Usage
Can be used from within Javascript to dissect the AST of a program or source file.

## Example
`Need to work on`

## Notes 

# ESLint with security extensions
https://eslint.org/ 
https://github.com/nodesecurity/eslint-plugin-security

## Description
Type: Out of box vulnerability search

Allows one to search javascript program for stylistic and some structural statements. Security extensions include templates for common vulnerabilities.

## Installation
- `npm install --save-dev eslint eslint-plugin-security`
- `./node_modules/.bin/eslint --init`
- Enable security plugin in `.eslintjs.rc`

## Documentation and resources
- https://eslint.org/docs/developer-guide/working-with-rules
- https://github.com/nodesecurity/eslint-plugin-security

## Usage 
Used from the command line `npx eslint ./Tools/exploitable.js`

## Notes

# NodeJSScan 

## Description
Type: Out of box vulnerability search

Intends to search web apps and code for vulnerabilities. When attempted to search trivially exploitable file, returned no results. **Non-viable**.

# Overall notes so far

Open source out of the box tools almost always lack the correct rulesets. The rulesets miss vital examples, do not show where an exploit occurs, and often flag non vulnerable code. These rulesets are often hard to fix requiring a deep understanding of the libraries they are built off of, and the ability to use the AST search tools in the context of pre-existing configuration. Navigating the configuration can be tricky and not always straight forward. Often these tools are built on systems which do not have straightforward paths to improving the searches (ESLint and the security plugins). It seems that many are non functional such as NodeJSScan. 

General AST tools have a lot of flexibility, but have no understanding of any security statements. This means any desired functionality will have to be added on our own. This will require a strong understanding of the AST search tools. These provide more powerful tracing of problematic assignments to  vulnerable statements, and may be able to provide more functionality than out of the box tools. These will require more work to get off the ground, but might provide a stronger guarantee, with improved searches. However, if reliability is not as much of an issue the time to make these tools viable for our usage may not be worth it compared to the out of box security solutions.

# More tools

- https://github.com/RetireJS/
- https://github.com/codecombat/aether
- https://github.com/wala/WALA




