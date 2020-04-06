const search = require("./search-estree.js");
const buildLinkedAST = require("./linked-estree").buildLinkedAST;

const sampleSource = `
var child_maker = require("child_process"), t = 2;
var child_process = require('child_process');
var execer = require('child_process').exec;
var execer2 = require('child_process').exec;
var e;
e = require('child_process');
var e2 = e;
var e3;
e3 = e;
e4 = e2;
e5 = e4;
execer('ls')
require('child_process').exec('ls');
child_maker.exec('ls')
`;

const sampleFile = "sample.js";

const execRule = search.createSymbolRule("Simple exec rule", "child_process", "exec");

// Get the ast with links to parents from string
var ast = buildLinkedAST(sampleSource);

//Create the searchable ast
var sast = search.createSearchableAST(ast);

// With the ast get all the places where the module is imported
var childRequires = search.searchRequiresForModule(execRule, search.getAllRequires(sast));

// With the require statements get all the 
var childVariableNames = search.getModuleVariableNames(execRule, childRequires);

// With the module variable names, propagate the module names
var childVariableNames = search.performModulePropagation(
  execRule,
 childVariableNames, 
 search.getAllDeclarators(sast), 
 search.getAllAssignments(sast)
 );


childVariableNames.forEach(function(node) {
  console.log(node.name);
})