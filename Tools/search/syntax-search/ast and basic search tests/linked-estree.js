const fs = require("fs");
const acorn = require("acorn");
const walk = require( 'estree-walker' ).walk;

var buildLinkedAST = function(source) {
  let ast = acorn.parse(source, {ecmaVersion: 6, locations: true,});
  walk(ast, {
    enter: function ( node, parent, prop, index ) {
      node.parent = function () { return parent };
    }
  });
  return ast;
}

var buildLinkedASTFromFile = function(path) {
  let source = fs.readFileSync(path).toString('utf-8');
  return buildLinkedAST(source);
}

module.exports = {
  buildLinkedAST: buildLinkedAST,
  buildLinkedASTFromFile: buildLinkedASTFromFile
}