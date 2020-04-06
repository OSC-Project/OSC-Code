var grasp = require('grasp'); 
var fs = require('fs');
var sleep = require('sleep');
var code = fs.readFileSync('exploitable.js', 'utf8');
var equerySearch = grasp.search('equery');
var require_child_process = equerySearch("require('child_process')", code);
var exec_calls = equerySearch('__.exec(__,__)', code);
var named_execs = equerySearch("var __ = require('child_process').exec",code);
//console.log(named_execs);
var named_execs_calls = [];
for (i in named_execs) {
  exec = named_execs[i];
  declaration = exec.declarations[0];
  named_query = equerySearch(declaration.id.name+'(__,__)', code);
  for (event in named_query){
    named_execs_calls.push(named_query[event]);
  }

} 
console.log(named_execs_calls);