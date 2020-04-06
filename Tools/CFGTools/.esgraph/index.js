var esgraph = require("esgraph")
var esprima = require("esprima")
var stringify = require('json-stringify-safe');
var fs = require("fs")

var source = fs.readFileSync( './test/test.js', 'utf8' )
/*
"var x = 2 + 2; \
if (x==4) { \
    x = 5; \
} else {  \
    x = 6; \
}";
*/

//Create CFG from parsed code
const cfg = esgraph(esprima.parse(source, { range: true }));

//convert circular object to JSON (cycles will appear as [Circular])
var json = stringify(cfg[0])
var dot = esgraph.dot(cfg, {counter: 1, source: source})
//Write JSON to file
fs.writeFile('code.dot', dot, function (err) {
  if (err) throw err;
  console.log('Saved CFG JSON!');
});

console.log(json);
