# Security Tools and Analysis {-}

# Tools

## Metadata Search

### Description
This type of tool attempts to keep Node.js and other projects free of known vulnerabilities in its dependencies by collecting a list of the open-source dependencies through the dependency list, and scraping known issues/vulnerabilities from repos where that package is hosted.

### Limitations
Because they are limited to open source packages, the majority of these services cannot scan user-created code for vulnerabilities, as the system relies on ones already found by the Internet, or by a member of their own private team. These services are also unable to procedurally detect any vulnerabilities, only able to flag ones found manually.

### List of tools

#### [Snyk](https://snyk.io/) 

<img src="https://res.cloudinary.com/snyk/image/upload/v1533761770/logo-1_wtob68.svg" height="100"/>

Snyk generally works as described above. Along with collecting known security issues with packages via the NIS, NVD, and NSP, Snyk also compiles its own database of issues, and will create patches for bugs the package developers haven't fixed.

https://snyk.io/

#### [SourceClear](https://www.sourceclear.com/) 

<img src="https://www.sourceclear.com/images/SourceClear_Logo_Primary_Black.png" height="60"/>

This tool is similar to Snyk, however SourceClear is able to do some scanning of user code to check for use of known vulnerable methods from dependencies. This feature is only available in paid versions.

> Premium users can view the actual vulnerable part of the library. Even if a vulnerable library is in use, SourceClear can identify if a vulnerable method is in use. If the specific vulnerable method in not in use, the project might not be subject to a potential exploit. **_-SourceClear FAQ_**

https://www.sourceclear.com/

## Parser based tools for Javascript

### Description 
Parsers take the source code and output the abstract syntax tree (AST). Because an AST is a structured representation of the statements, they can be used by programs to understand other programs. Parser based tools use an interpreter or other system to generate the AST and present interfaces for human or programmatic consumption.  Can be used to search the source more efficiently than simple text search utilities, and some tracing of variables. 

### Limitations
Most parsing tools are general purpose and therefore not heavily concerned with including security analysis functionality. In order to get value out of these we will have to build a way to define and search for vulnerable snippets. This can be done by defining a template of the vulnerability. 

Parsing is static analysis and javascript's dynamism makes learning things through traditional static analysis difficult.

### List of tools

#### [graspJS](https://www.graspjs.com/)
Can perform searches on the parse tree. Particularly useful are the two syntaxes one which builds the search from sample code blocks, and another which builds queries from parse tree structures. Provides the ability to search from javascript and from the command line. 

https://www.graspjs.com/

Example
```javascript
var grasp = require('grasp');
var fs = require('fs');
var code = fs.readFileSync('exploitable.js');
var equerySearch = grasp.search('equery');
var nodes = equerySearch('require("__")', code);
```
In grasp __ is a wildcard. nodes will contain the points in the AST where any library is included. 

#### [Esprima](http://esprima.org/) 
Can parse and tokenize code into data structures usable inside of javascript. Does not have the searching capabilities of graspJS, would need to add them manually. Whereas graspJS provides good search functionality on the source, esprima provides the tokens and AST of a given statement. Useful when a search is what we want and we need to understand specific statements. 

http://esprima.org/

#### [ESLint](https://eslint.org/) with [Security Plugin](https://github.com/nodesecurity/eslint-plugin-security)
Can tokenize and parse programs. ESLint has the ability to add new rules to flag when run on source code. The security plugin adds rule sets for various common vulnerabilities. The rules require extending to be more useful, there are many false positives, and it misses some trivial exploits. It seems to be difficult to extend. The extension building is focused on linting and pushing easily spotted problems to the developer, rather than for continued programmatic consumption. 

https://eslint.org/
https://github.com/nodesecurity/eslint-plugin-security

False positive and negative example
```javascript
var child_process = require('child_process');
var execer = child_process.exec;
function reckless_exec(unsanitized){
  execer(unsanitized);
}  
```
ESLint will flag the first line, which is clearly a false positive as including child_process is not a vulnerability in itself. However it will also ignore fourth line where the exploit actually occurs! So while ESLint is very helpful it can fail quite easily. 

## Analysis Tools 

### Description 
These modules allow for more sophisticated analysis of javascript code, of interest is tracing call structure and bounding variables. They have built in methods to build more sophisticated structures, specifically we are interested in call graphs and dynamic symbol execution. These tools can perform procedures which may not be humanly possible. Important to use as javascript's dynamism means that these structures are hard to build using traditional methods. 

### Limitations
These tools are oriented towards more advanced use cases and therefore don't provide easy interfaces for simple tasks. We will need to combine them with the easier to use tools in order to improve their effectiveness. The simple tools will identify specific instances of problematic symbols, and the analysis tools will be used to follow those instances. This will require defining interfaces between the tools. These tools minimally require a strong understanding of the project's goals and how they are built. 

### List of tools

#### WALA for JS
Can build and analyze call trees. Provides methods to traverse, test, and understand the graph quickly and easily. Can normalize code for consumption in other systems. Written in java, but there is a javascript implementation.  

Java implementation available [here](http://wala.sourceforge.net/wiki/index.php/Main_Page)

http://wala.sourceforge.net/wiki/index.php/Main_Page

Javascript implementation available [here](https://github.com/wala/JS_WALA)

https://github.com/wala/JS_WALA

#### Aratha
Newly published constraint programming system which can be used for dynamic symbolic execution. Useful for finding which execution states will actually expose vulnerable interfaces. Includes built in models for its constraint programming system to read javascript. Will require a decent amount of work, but a very powerful way to understand source code. 

Paper available [here](https://people.eng.unimelb.edu.au/pstuckey/papers/cpaior19d.pdf)

https://people.eng.unimelb.edu.au/pstuckey/papers/cpaior19d.pdf

# Methodology
An essential outcome of this project is a methodology that provides Comcast developers with a step-by-step 
process that helps developers to find code vulnerabilities in their components and eventually decide whether 
those components are reliable or not. This process will benefit from manual inspection of the code, tools, commercial and 
open source, of different kinds and purposes, and eventually our predictor that will be developed at some point. The 
idea is to compile information from many sources and produce an intelligent recipe that does that work. This step-by-step
process could be presented as a witten text or/and a flow diagram. 

# Manual Analysis
We can split the manual analysis into two major parts, surveying and security analysis.

The content below is a work in progress. These are the student's tasks we have worked on, are working on, and will work on. If something is missing or is not desirable feel free to speak up.

## Exploit and tool surveying 
Performing the security analysis is an important step, so we need to verify quality. Therefore as we progress exploit data will be needed to test of our tools and verify our own competence. There are sample exploitable code chunks in our other write ups, but those are trivially spotted and won't provide sufficient cases. We will need to use some of the tools we have to find more exploitable code. 

### Goals
- Draft write ups on selected exploit types and tools
  - Help get all members on the project an understanding of how to find, use, and patch exploits
  - Provide useful information on tools and vulnerabilities.
  - Get thinking about initial methods of performing security analyses. 
- Create a dataset of known vulnerable code that our analysis should be able to find.
  - Used to create test cases for automated tools
  - Check our own capabilities for manual procedures
  - Done in tandem with security analysis, new data is seeked out as needed.
- Identify and add discovered exploit variants to the write ups.

### Planned Method
Use the metadata search tools to identify exploits spotted by other researchers. Starting with packages given to us by Comcast. We can use ESLint from the parsing tools to quickly find some potential exploits. Drafting write ups is complete. 

### Useful Tools
- Metadata: SourceClear
- Metadata: Snyk
- Parsing: ESLint with Security Plugins
  - Look through rule sets to find new vulnerable symbols
  - Will be used to try to spot unknown exploits

## Security analysis
On their own each of the tools in the document serves a specific need, however none of them can easily provide a strong security analysis. By bringing them together we can create stronger security analysis tools. We will use regexes and AST searches to see where vulnerable symbols are placed, use a call graph to trace where those vulnerable symbols are passed around, and use a dynamic symbol execution tool to see what paths actually lead to a vulnerable symbol being executed.

### Goals
- Provide a way to define searches for the vulnerable symbols. 
  - Specify the library.
  - Specify the functions.
  - Specify the parameter configurations.
- Determine if it is practical to construct automated tools and do so if possible for the following 
  - Search for variables the library or the specific functions are put into. 
  - Trace and find where variables are inherited, bound to, passed into, and returned to. 
  - Reduce locations to those which actually invoke the target functions with target parameter configurations.
  - Attempt to attack the vulnerable locations.
- Turn exploit write up content into searches. 
- Add how to search with the tools to write ups. 


### Planned Method
The searching will be done by identifying instances of the target libraries and functions which are bound to variable or unnamed instances. The tracing will be done by building a call graph and checking if the identified instances are being propagated through it. Analysis will take all of the locations where searched and traced instances appears, and check if the vulnerable function is called with the specified parameter configuration. 

### Useful tools
- `grep`, `sed`, `awk`
  - Preprocess code to make it easier to search
- Parsing: graspJS
  - Use for the initial instance search
- Analysis: WALA
  - Preprocess code by normalizing it
  - Generate call graph
- Parsing: esprima
  - Call graph generation using https://github.com/cwi-swat/javascript-call-graph
  - Basic check of the parameter configurations
- Analysis: Aratha
  - Bounding of parameters and variables

### Starting example
An example vulnerability template for exec would state the following information
```
Source Library: child_process
Function: exec
Parameter Constraints: Non-literal first argument
```

Extending the ESLint example above
```javascript
var child_process = require('child_process');
var execer = child_process.exec;
function reckless_exec(unsanitized){
  execer(unsanitized);
}  
function vulnerable_if_true(dangerous, user_input) {
  if (dangerous) {
    reckless_exec("echo "+user_input);
  }
  else {
    reckless_exec("echo safe!");
  }
}
```

Given a template for an exec vulnerability. Our tool should internally identify the child_process carrying the library, the binding of exec into execer. Due to the unsafe call to execer in reckless_exec, that function should be flagged. We also need to glag the the vulnerable_if_true function too as should dangerous be truthy it exposes a vulnerable interface. 
