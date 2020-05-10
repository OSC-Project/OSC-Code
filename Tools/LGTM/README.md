# LGTM++ 

## Description
The purpose of LGTM++ is to better utilize the [CodeQL query language](https://help.semmle.com/QL/learn-ql/introduction-to-ql.html) to better analyze JavaScript source code for vulnerablities particularly pertaining to Code Injection, SQL Injection and OS injection. The primary uses of LGTM++ is automation of the [CodeQL Query Analysis process](https://help.semmle.com/codeql/codeql-cli.html) The queries developed by our group is located in [OSC_CodeQueries directory](https://github.com/OSC-Project/OSC-Code/tree/master/Tools/LGTM/OSC_CodeQueries) <br> 
Last Update: 05/10/2020

## Build
CodeQL Command-Line toolchain version: 2.0.4. <br>
NodeJS Version: V10.15.2
NPM Version: 6.4.1 
Operating System: Windows 10, MacOS Catalina, Linux (was developed on Windows 10) <br>

## User Guide
This guide assumes that NodeJS and NPM are installed, for further help on installing please see [Downloading and installing Node.js and npm](Downloading and installing Node.js and npm)

### Installing
LGTM++ itself does not require any installations but depends on certain software to be downloaded for usage. LGTM++ 
  

## Files
CodeQl_Automation.py - Script that is used for automation of CodeQL CLI <br>
LGTM_Commands.txt - Cheatsheet for running CodeQL CLI manually <br>
ql - Directory of Semmle's git clone of [QL repository](https://github.com/github/codeql), contains assets that CodeQL and LGTM uses when making databases and compiling queries <br>
OSC_CodeQueries - Directory that contains Queries that our group has made <br>
Query_Results - Directory that contains results of package and query pairs 
packageExample.json - An example of how to format json file for running on multiples packages <br>
queriesExample.json - An example of how to format json file for running with multiples queries <br>


## Design Specs 
placeholder 

## Known Issues 
placeholder 

## Contact
* Kerwin Mercado (Kerwin.mercado@uconn.edu)
* Ahmad Jbara (ahmadjbara@gmail.com)




