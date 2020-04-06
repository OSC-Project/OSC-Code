var grasp = require('grasp'); 
var fs = require('fs');

function createLibrary(name) {
  let library = new Object();
  library.name = name;
  library.entryPoints = []
  library.requireds = undefined;
  return library;
}

function addEntryPointLibrary(library, entry) {
  library.entryPoints.push(entry);
}

function searchInstancesLibrary(library, code) {
  library.requireds = grasp.search('equery', "require('"+library.name+"')",code);
}

function expandRequiresLibrary(library) {
  library.requireds.forEach(function(element) {
    console.log(element.arguments);
  });
}

var child_process = createLibrary("child_process");
addEntryPointLibrary(child_process, "exec");
var exploitable = fs.readFileSync("exploitable.js", 'utf8');
searchInstancesLibrary(child_process, exploitable);
expandRequiresLibrary(child_process);
//console.log(child_process);