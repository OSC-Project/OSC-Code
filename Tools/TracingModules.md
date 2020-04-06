## Analysis Tools 
_Work in progress_

### Description 
These modules allow for more sophisticated analysis of Javascript code, of interest is tracing call structure and bounding variables. They have built in methods to build more sophisticated structures and analyze code statements. These tools can perform procedures which may not be humanly possible. Important to use as Javascript's dynamism means that these structures are hard to build using traditional methods. 

### Limitations
As with parsing tools, they do not include strong security built in rule sets. These tools are oriented towards more advanced use cases and therefore don't provide easy interfaces for simple tasks. They minimally require a modest understanding of the project's goals and how they are built. 

### List of tools

#### WALA for JS
Can build and analyze call trees. Provides methods to traverse, test, and understand the graph quickly and easily. Written in java, but there is a javascript interface. 

#### Aratha
Newly published constraint programming system which attempts to bound and understand dynamic symbols in many languages. Includes models for javascript in system. Will require a decent amount of work, but a very powerful way to understand variables.

Paper available (here)[https://people.eng.unimelb.edu.au/pstuckey/papers/cpaior19d.pdf]