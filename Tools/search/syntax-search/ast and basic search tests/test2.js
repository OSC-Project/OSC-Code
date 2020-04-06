var esgraph = require("esgraph");
var esprima = require("esprima");
const fs = require("fs");
source = fs.readFileSync('bench/b03.js').toString('utf-8');
const cfg = esgraph(esprima.parse(source, { range: true, loc: true }));

const walk = require( 'estree-walker' ).walk;

//var tree = cfg[0].astNode.body;

const methodFinder = function(tree, location) {
	var result = []
	walk(tree, {
		enter: function (node,p,prop,index) {
				if (node.loc.start.line === location.start.line &&
						node.loc.start.column === location.start.column &&
						node.loc.end.line === location.end.line &&
						node.loc.end.column === location.end.column) {
					result.push({loc: location, n: p});
				}
			}
	});
	return result;
}
console.log(cfg);
const flow = cfg[2];
const fileLoc = JSON.parse(fs.readFileSync('log.json')).files[3].vulns.sql;
var interest = [];
for (var j = 0; j < fileLoc.length; j++) {
	for (var i = 0; i < flow.length; i++) {
		if (flow[i].type !== 'exit' && flow[i].type !== 'entry') {
			var found = methodFinder(flow[i].astNode, fileLoc[j]);
			if (found.length !== 0) {
				interest.push({flowNode: i});
			}
		}
	}
}
//console.log(cfg[2][0].type);
//console.log(interest);
//console.log(cfg);
//console.log(esgraph.dot(cfg, {counter : 0, source: source}));
