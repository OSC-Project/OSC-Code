const ASTQ  = require("astq");

var createSymbolRule = function(name, mod, symbol) {
  return {
    name: name,
    module: mod,
    symbol: symbol
  };
}

var createSearchableAST = function(ast) {
  astq = new ASTQ();
  astq.adapter('mozast')
  return {
    ast: ast,
    astq: astq
  };
}

var getAllRequires = function(sast) {
  return sast.astq.query(sast.ast, `
    // CallExpression [
           /:callee   Identifier [ @name == 'require']
    ]
  `);
}

var getRequiresNoVariables = function(sast) {
  return sast.astq.query(sast.ast, `
    // CallExpression [
      /:callee   Identifier [ @name == 'require']
    ]
  `).filter(
    function(node) {
      return !(
        node.parent().type === "VariableDeclarator" 
        || node.parent().type === "AssignmentExpression"
      );
    }
  );
}

var getAllDeclarators = function(sast) {
  return sast.astq.query(sast.ast, `//VariableDeclarator`);
}

var getAllAssignments = function(sast) {
  return sast.astq.query(sast.ast, `//AssignmentExpression`);
}

var searchRequiresForModule = function (rule, requires) {
  let requireNodes = [];
  if (rule.module !== "_") {
    requires.forEach(function (node) {
      if (node.arguments[0].value === rule.module) {
        requireNodes.push(node);
      }
    });
  }
  return requireNodes;
}

var getModuleVariableNames = function (rule, requireNodes) {
  let idNodes = [];
  if (rule.module !== "_") {
    requireNodes.forEach(function (node){
        if (node.parent().type === "VariableDeclarator") {
            idNodes.push(node.parent().id);
        }
        else if (node.parent().type === "AssignmentExpression") {
          if(node.parent().left.type === "Identifier") {
            idNodes.push(node.parent().left);
          }
        }
    });
  }
  return idNodes;
}

var checkVariableDeclarators = function(names, declaratorNodes) {
  return declaratorNodes.filter(function(node) {
    return node.init 
      && node.init.type === 'Identifier'
      && names.has(node.init.name);
  });
}

var checkVariableAssignments = function(names, assignmentNodes) {
  return assignmentNodes.filter(function(node) {
    return node.left.type === 'Identifier'
      && node.right.type === 'Identifier' 
      && names.has(node.right.name);
  });
}

var extractDeclaratorIds = function(declaratorNodes) {
  return declaratorNodes.map(function(node) {
    return node.id; 
  });
}

var extractAssignmentIds = function(assignmentNodes) {
  return assignmentNodes.map(function(node) {
    return node.left; 
  });
}

var propagateModuleName = function (rule, idNodes, declaratorNodes, assignmentNodes) {
  let names = new Set();
  idNodes.forEach(function(node) {
    names.add(node.name);
  });
  let declaratorNames = extractDeclaratorIds(checkVariableDeclarators(names, declaratorNodes));
  let assignmentNames = extractAssignmentIds(checkVariableAssignments(names, assignmentNodes));
  let originalNodes = new Set(idNodes);
  return [...idNodes, ...declaratorNames.filter(node => !originalNodes.has(node)), ...assignmentNames.filter(node => !originalNodes.has(node))];
}

var performModulePropagation = function (rule, idNodes, declaratorNodes, assignmentNodes) {
  let length = idNodes.length;
  do {
    length = idNodes.length;
    idNodes = propagateModuleName(rule, idNodes, declaratorNodes, assignmentNodes);
  } while (length != idNodes.length)
  return idNodes;
}

module.exports = {
  createSymbolRule: createSymbolRule,
  createSearchableAST: createSearchableAST,
  getAllRequires: getAllRequires,
  getAllDeclarators: getAllDeclarators,
  getAllAssignments: getAllAssignments,
  searchRequiresForModule: searchRequiresForModule,
  getModuleVariableNames: getModuleVariableNames,
  performModulePropagation: performModulePropagation,
}