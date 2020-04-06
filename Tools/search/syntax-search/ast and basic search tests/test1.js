le = require('./linked-estree');
var assert = require('assert');
const walk = require( 'estree-walker' ).walk;


var tree = le.buildLinkedASTFromFile('bench/b01.js');

console.log(tree);
console.log(tree.body[0].declarations[0].id.name);
console.log(tree.body[0].declarations[0].init);

var isCall = tree.body[0].declarations[0].init.type === 'CallExpression' ;
var receiver = tree.body[0].declarations[0].init.callee.object
var method   = tree.body[0].declarations[0].init.callee.property
var args     = tree.body[0].declarations[0].init.arguments
assert(method.type === 'Identifier');

console.log(tree.body[0].declarations[0].init.type, " ",isCall);
console.log(receiver.name);
console.log(method.name);
console.log(args, args.length);

console.log("=====================================");

const methodFinder = function(tree,method) {
	var result = []
	walk(tree, {
		enter: function (node,p,prop,index) {
			if (node.type === 'CallExpression' &&
				node.callee.property.name === method) {
				//console.log(node)
				result.push({ 
					receiver : node.callee.object,
					args     : node.arguments
				});
			}
		}
	});
	return result;
}

const mySQLVulnerabilityFinder = function(tree) {
	const qCall = methodFinder(tree,'query');

	for (var i = 0; i < qCall.length; i++) {
		if (qCall[i].receiver.type === 'Identifier')
			console.log("found a call on " + qCall[i].receiver.name + " to query(" + 
						qCall[i].args[0].name + ")"
					);	
	}
}

allVuln = mySQLVulnerabilityFinder(tree)