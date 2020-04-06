# Javascript Parsing Tools

## Description 
Parsers take the source code in a file and extract the meaning from the statements, without running it. These tools take the parsing output and present it for human or programmatic consumption. This allows us to understand and use the meaning of statements and their components. Can be used to search the source more efficiently than simple text search utilities, and some tracing of variables. 

## Limitations
Most parsing tools are general purpose and therefore not heavily concerned with including security analysis functionality. We will have to build queries of some vulnerabilities into these tools before they yield anything. This could be laborious. 

Parsing is static meaning that Javascript's dynamism makes answering the following difficult.
- Will a vulnerable procedure from a library ever show up in a context where it will be executed? 
- Some vulnerable procedures have non vulnerable calls. When is our offending symbol used in an unsafe manner? 
- A non vulnerable symbol could be made less secure by a particular input, when does this happen?


## List of tools

### graspJS
Can perform searches on the parse tree. Particularly useful are the two syntaxes one which builds the search from sample code blocks, and another which builds queries from parse tree structures. Provides the ability to search from javascript and from the command line. 


### Esprima 
Can parse and tokenize code into data structures usable inside of javascript. Does not have the searching capabilities of graspJS, would need to add them manually. Provides a more easily accessed interface to the root of the source.

### ESLint with Security Plugin
Linter which has the ability to add new rules. The security plugin adds rule sets for various common security vulnerabilities. The rules require extending to be more useful, there are many false positives, and it misses some trivial exploits. It seems to be difficult to extend. The extension building is focused on linting and pushing easily spotted problems to the developer, rather than for continued programmatic consumption. 
