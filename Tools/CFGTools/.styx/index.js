var styx = require("styx")
var Esprima = require("esprima")
var fs = require('fs')

var code = fs.readFileSync( './test/test.js', 'utf8' )

/*
"var x = 2 + 2; \
if (x==4) { \
    x = 5; \
} else {  \
    x = 6; \
}";
*/

//Create AST from code
var ast = Esprima.parse(code);

//Create CFG from AST
var flowProgram = styx.parse(ast);

//Export to JSON
var json = styx.exportAsJson(flowProgram);

//Write JSON to file
fs.writeFile('./test/code.json', json, function (err) {
  if (err) throw err;
  console.log('Saved CFG JSON!');
});

//console.log(json);
