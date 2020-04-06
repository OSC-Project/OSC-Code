const acorn = require('acorn');							//ast parser / bulder
const walk = require('estree-walker').walk;		//tree walker function
var fs = require('fs');
var path = require('path');

var buildLinkedASTFromFile = function(filePath) { // builds and returns an AST
	let source = fs.readFileSync(filePath).toString('utf-8');
	let ast = acorn.parse(source, {ecmaVersion: 6, locations: true,
							allowHashBang: true, allowImportExportEverywhere: true,}); //sourceType: 'module',});
	return ast;
};

const packageData = function(rec, argz, tree = null, prev = null, typeSearch = null, directory = null){
	//packs data to be returned
	return {
		receiver 	: rec,
		args			: argz,
		scope 		: tree,
		previous	: prev,
		type 			: typeSearch,
		path      : directory
	}
};

const methodFinder = function(tree, type, method, name, ii = null, dir) {
	var result = [];
	walk(tree, { //from estree.walk
		enter: function (node, p, prop, index) { //returns current node, parent node, properties of the node (if it has any), and the index #
			switch (type) {
				case 'm': //if the current node is a method
				if (node.type === 'CallExpression'){
					switch (node.callee.type) {
						case 'Identifier':
						if(node.callee.name === method) {
							if (!node.callee.object) {
								result.push(packageData(node.callee, node.arguments, node.callee));
							}else if (node.callee.object.type === 'Identifier') {
								result.push(packageData(node.callee.object, node.arguments, tree));
							}else if (node.callee.object.type === 'CallExpression') {
								result.push(packageData(node.callee.object, node.arguments, node.callee));
							}
						}
						break;
						case 'MemberExpression':
						if(node.callee.property.name === method || node.callee.property.value === method) {
							if (!node.callee.object) {
								result.push(packageData(node.callee, node.arguments, node.callee));
							}else if (node.callee.object.type === 'Identifier') {
								result.push(packageData(node.callee.object, node.arguments, tree));
							}else if (node.callee.object.type === 'CallExpression') {
								result.push(packageData(node.callee.object, node.arguments, node.callee));
							}else if (node.callee.object.type === 'MemberExpression') {
								result.push(packageData(node.callee.object, node.arguments, tree));
							}
						}
						break;
						case 'SequenceExpression':
							for (var k= 0; k < node.callee.expressions.length; k++) {
								if (node.callee.expressions[k].name === method) {
									result.push(packageData(node.callee, node.arguments, tree));
								}
							}
							break;
					}
				}
				break;

				case 'v': //if the current node is a variable declaration
				if (node.type === 'VariableDeclaration'){
					//console.log(node.declarations[3].id);
					if(node.declarations[0].id.name === name) {
						if (node.declarations[0].init) {
							if (node.declarations[0].init.type === 'CallExpression'){
								switch (node.declarations[0].init.callee.type) {
									case 'Identifier':
									if(node.declarations[0].init.callee.name === method) {
										result.push(packageData(node.declarations[0].init.callee, node.declarations[0].init.arguments, p));
									}
									break;
									case 'MemberExpression':
									if(node.declarations[0].init.callee.property.name === method) {
										result.push(packageData(node.declarations[0].init.callee.object, node.declarations[0].init.arguments, p));
									}
									break;
								}
							}
						}
					}else if(node.declarations[0].init){//used for function calls with a name
							if (node.declarations[0].init.type === 'FunctionExpression') {
								for (var i = 0; i < node.declarations[0].init.params.length; i++) {
									if (node.declarations[0].init.params[i].name === name) {
										let argVal = methodFinder(tree, 'f', method, node.declarations[0].id.name, i);
										let argRes = methodFinder(tree, type, method, argVal[0]);
										result = argRes;
									}
								}
							}
						}
					}else if (node.type === 'ExpressionStatement'){
						if (node.expression.type === 'CallExpression') {
							if (node.expression.callee.type === 'FunctionExpression') {//used for lambda function calls
								for (var i = 0; i < node.expression.callee.params.length; i++) {
									if (node.expression.callee.params[i].name === name){
										result = methodFinder(tree, type, method, node.expression.arguments[i].name);
									}
								}
							}
						}
					}
					break;
				case 'f': //searches for parameter defined in a method/function
				if (node.type === 'ExpressionStatement') {
					if (node.expression.callee) {
						if (node.expression.callee.name === name) {
							if (ii === null) {
								result.push(packageData(node.expression.callee, node.expression.arguments, p));
							}else {
								result.push(node.expression.arguments[ii].name);
							}
						}
					}
				}
				break;
				case 'r': // searching for a variable required by another file
				if (node.type === 'VariableDeclaration'){
					if(node.declarations[0].id.name === name[0]) {
						if (node.declarations[0].init.callee) {
							//console.log(node.declarations[0].init.callee);
							if(node.declarations[0].init.callee.name === 'require') {
								let str = node.declarations[0].init.arguments[0].value;
								if (str.includes("/")) {
									if (str[0] === '.' && str[1] !== '.') {
										str = path.resolve(dir, str.substring(2));
									}else if(str[0] === '.' && str[1] === '.'){
										let holder = path.parse(dir).dir;
										str = path.resolve(holder, str.substring(3))
									}
									let newAST = buildLinkedASTFromFile(str);
									let findings = methodFinder(newAST, 'e', method, name[1]);
									if (typeof findings[0] === 'string') {
										result = methodFinder(newAST, 'm', method, findings[0]);
									} else{
										result = findings;
									}
								}
							}
						}
					}
				}
					//console.log(reqs);
					//search for declaration of the name
					//check if the require is a path
					//open that file and check for exports
					break;
					case 'e':
					if (node.type === 'ExpressionStatement') {
						if (node.expression.type === 'AssignmentExpression') {
							if (node.expression.right.type === 'ObjectExpression') {
								for (var i = 0; i < node.expression.right.properties.length; i++) {
									if (node.expression.right.properties[i].key.name === name) {
										switch (node.expression.right.properties[i].value.type) {
											case 'CallExpression':
											if (node.expression.right.properties[i].callee.property.name === method) {
												result.push(packageData(node.expression.right.properties[i].value.callee.object, node.expression.right.properties[i].value.arguments, tree));
											}
											break;
											case 'Identifier':
											result.push(node.expression.right.properties[i].value.name);
											break;
										}
									}
								}
							}else if (node.expression.left.property.name === name) {
								switch (node.expression.right.type) {
									case 'CallExpression':
									if (node.expression.right.callee.property.name === method) {
										result.push(packageData(node.expression.right.callee.object, node.expression.right.arguments, tree));
									}
									break;
									case 'Identifier':
									result.push(node.expression.right.name);
									break;
								}
							}
						}
					}

					break;
					case 'a':
					if (node.type === 'AssignmentExpression') {
						if (node.left.name === name) {
							result.push(node.right);
						}
					}else if (node.type === 'VariableDeclarator') {
						if(node.id.name === name){
							result.push(node.init);
						}
					}else {
						result.push({type : 'NotLiteral'});
					}
					break;
				}
			}
		});
return result;
};

const filterFunction = function(method, arr){//filters the list to find if the method is called
	res = [];
	for (var k = 0; k < arr.length; k++) {
		const found = methodFinder(arr[k].scope, arr[k].type, method, arr[k].receiver.name, null, arr[k].path);
		for (var i = 0; i < found.length; i++) {
			if (found.length === 0) {
			}else if(found[i].receiver.type === 'Identifier'){
				res.push(packageData(found[i].receiver, found[i].args, found[i].scope, arr[k], 'v', arr[k].path));
			}else if (found[i].receiver.type === 'CallExpression') {
				res.push(packageData(found[i].receiver.callee, found[i].args, found[i].scope, arr[k], 'm', arr[k].path));
			}else if (found[i].receiver.type === 'MemberExpression') {
				res.push(packageData({name: [found[i].receiver.object.name, found[i].receiver.property.name], loc: found[i].receiver.loc}, found[i].args, found[i].scope, arr[k], 'r', arr[k].path));
			}else if (found[i].receiver.type === 'SequenceExpression') {
				res.push(packageData(found[i].receiver, found[i].args, found[i].scope, arr[k], 'v', arr[k].path));
			}
		}
	}
	return res;
};

const filterRequire = function(moduleName, arr){//checks that the require is to the correct module
	result = [];
	for (var k = 0; k < arr.length; k++) {
		const found = methodFinder(arr[k].scope, arr[k].type, 'require', arr[k].receiver.name, arr[k].path);
		for (var i = 0; i < found.length; i++) {
			if (found.length === 0) {
			}else if(found[i].args[0].value === moduleName){
				result.push(packageData(found[i].receiver, found[i].args, found[i].scope, arr[k]));
			};
		}
	}
	return result;
};

const findBase = function(list){//returns the original calls of all the successful filters
	let result = [];
	for (var i = 0; i < list.length; i++) {
		while (list[i].previous.previous !== null){
			list[i] = list[i].previous;
		}
		result.push(list[i]);
	}
	return result;
};

const verifyArgs = function(list){//checks the args' types
	let result = [];
	for (var i = 0; i < list.length; i++) {
		for (var j = 0; j < list[i].args.length; j++) {
			switch (list[i].args[j].type) {
				case 'Literal': //do nothing
					break;
				case 'Identifier':
					const found = methodFinder(list[i].scope, 'a', null, list[i].args[j].name);
					if (found[0].type !== 'Literal') {
						if(!result.includes(list[i])){
							result.push(list[i]);
						}
					} //may want to make recursive
					break;//Search for variable and check definition
				case 'BinaryExpression':
					if (list[i].args[j].left.type !== 'Literal' || list[i].args[j].right.type !== 'Literal') {
						if(!result.includes(list[i])){
							result.push(list[i]);
						}
					}
					break;//Might be concatinating
				case 'CallExpression':
					result.push(list[i]);
				default:
					result.push(list[i]);
				break;
			}
		}
	}
	return result;
}

const mySQLVulnerabilityFinder = function(tree, dir) {
	let result = [];
	let blank = [packageData({name: ''}, null, tree, null, 'm', dir)];//blank data struct to fill
	var qCalls = filterFunction('query', blank); //returns a list of objects that call query
	var cons = filterFunction('createConnection', qCalls); //returns a list of objects that call createConnection
	var entries = filterRequire('mysql', cons); //returns a list of mysql require calls
	var successfulQCalls = findBase(entries); //returns a list of successful query calls
	var dangerousCalls = verifyArgs(successfulQCalls); //checks the args if it's a literal or has input
	for (var i = 0; i < dangerousCalls.length; i++) {
		result.push(dangerousCalls[i].receiver.loc);
	}
	return result;
};

const execVulnerabilityFinder = function(tree, dir) {
	let result = [];
	let blank = [packageData({name: ''}, null, tree, null, 'm', dir)];
	var eCalls = filterFunction('exec', blank);
	var connection = filterRequire('child_process', eCalls);
	var success = findBase(connection);
	var dangerousCalls = verifyArgs(success);
	for (var i = 0; i < dangerousCalls.length; i++) {
		result.push(dangerousCalls[i].receiver.loc);
	}
	return result;
};

const execSyncVulnerabilityFinder = function(tree, dir) {
	let result = [];
	let blank = [packageData({name: ''}, null, tree, null, 'm', dir)];
	var eCalls = filterFunction('execSync', blank);
	var connection = filterRequire('child_process', eCalls);
	var success = findBase(connection);
	var dangerousCalls = verifyArgs(success);
	for (var i = 0; i < dangerousCalls.length; i++) {
		result.push(dangerousCalls[i].receiver.loc);
	}
	return result;
};

const evalVulnerabilityFinder = function(tree, dir) {
	let result = [];
	let blank = [packageData({name: ''}, null, tree, null, 'm', dir)];
	var eCalls = filterFunction('eval', blank);//.concat(filterFunction('Function', blank));
	var dangerousCalls = verifyArgs(eCalls);

	for (var i = 0; i < dangerousCalls.length; i++) {
		result.push(dangerousCalls[i].receiver.loc);
	}
	return result;
};
const finder = function(tree, method="") {
	var result = [];
	let type = 'm';
	walk(tree, { //from estree.walk
		enter: function (node, p, prop, index) { //returns current node, parent node, properties of the node (if it has any), and the index #
				if (node.type === 'CallExpression'){
					switch (node.callee.type) {
						case 'MemberExpression':
						if(node.callee.computed) {
							if (method == "" || (node.callee.property && node.callee.property.name == method)) {
								if (node.callee.property.type == "ConditionalExpression") {
									if (node.callee.property.alternate.type == "Literal" &&
										node.callee.property.consequent.type == "Literal"
									) {
										break;
									}
								}
								else if (node.callee.property.type == "Identifier") {
									if (node.callee.property.name == "i") {
										break;
									}
								}

								if (!node.callee.object) {
									result.push(packageData(node.callee, node.arguments, node.callee));
								}else if (node.callee.object.type === 'Identifier') {
									result.push(packageData(node.callee.object, node.arguments, tree));
								}else if (node.callee.object.type === 'CallExpression') {
									result.push(packageData(node.callee.object, node.arguments, node.callee));
								}else if (node.callee.object.type === 'MemberExpression') {
									result.push(packageData(node.callee.object, node.arguments, tree));
								}
							}
						}
						break;
					}
				}
			}
		})
		let res = [];
		var dCalls = verifyArgs(result);
		if (dCalls.length !== 0) {
			for (var i = 0; i < dCalls.length; i++) {
				res.push(dCalls[i].receiver.loc);
			}
		}
	return res;
};

const findVulns = function(tree, directory){
	var foundVulns = new Object;
	sqlData = mySQLVulnerabilityFinder(tree, directory);
	execData = execVulnerabilityFinder(tree, directory);
	evalData = evalVulnerabilityFinder(tree, directory);
	e2 = execSyncVulnerabilityFinder(tree, directory);

	callData = finder(tree, 'call');
	applyData = finder(tree, 'apply');
	objData = finder(tree);

	if (sqlData.length !== 0) foundVulns.sql = sqlData;
	if (execData.length !== 0) foundVulns.os = execData;
	if (evalData.length !== 0) foundVulns.js = evalData;
	if (e2.length !== 0) foundVulns.os2 = e2;

	if (callData.length !== 0 && process.argv[3]) foundVulns.call = callData;
	if (applyData.length !== 0 && process.argv[3]) foundVulns.apply = applyData;
	if (objData.length !== 0 && process.argv[3]) foundVulns.obj = objData;

	if (sqlData.length === 0 && evalData.length === 0 && execData.length === 0 && e2.length === 0 && (callData.length === 0 || !process.argv[3])
			&& (applyData.length === 0 || !process.argv[3]) && (objData.length === 0 || !process.argv[3])) {
		return null;
	} else {
		return foundVulns;
	}
};

fs.unlinkSync("review.json");
var stream = fs.createWriteStream("review.json", {flags:'a'});

fs.unlinkSync("log.json");
var logStream = fs.createWriteStream("log.json", {flags:'a'});

const dirScan = function(curpath, curfiles){
	var data = {
		dir   : curpath,
		files : []
	};
	for (var i = 0; i < curfiles.length; i++) {
		var file = {
			name  : null,
			vulns : null
		};
		if (path.extname(curfiles[i]) === '.js' && curfiles[i][0] !== '.' && !curfiles[i].includes('min')
				&& curfiles[i] !== 'test.js' && curfiles[i] !== 'example.js'){
			file.name = curfiles[i];
			//console.log("building tree for: "+file.name+" in: "+ data.dir);
			try {
				const ast = buildLinkedASTFromFile(path.resolve(data.dir, file.name));
				file.vulns = findVulns(ast, data.dir);
				if(file.vulns !== null) {
					logStream.write(JSON.stringify(data.dir) + "\tFile: " + JSON.stringify(file.name)+ '\n');
					logStream.write(JSON.stringify(file.vulns)+'\n');//, null, '\t'));
					if(file.vulns.sql) logStream.write("SQL = "+file.vulns.sql.length+'\n');
					if(file.vulns.os) logStream.write("OS = "+file.vulns.os.length+'\n');
					if(file.vulns.os2) logStream.write("OS2 = "+file.vulns.os2.length+'\n');
					if(file.vulns.js) logStream.write("JS = "+file.vulns.js.length+'\n');
					if(file.vulns.call) logStream.write("CALL = "+file.vulns.call.length+'\n');
					if(file.vulns.apply) logStream.write("APPLY = "+file.vulns.apply.length+'\n');
					if(file.vulns.obj) logStream.write("OBJ = "+file.vulns.obj.length+'\n');
					logStream.write('\n\n');
				};
			} catch (e) {
				stream.write(data.dir + " " + file.name+ '\nHas error: ' +e.name+ ' ' + e.message+ '\n\n');
			};
		}else{
			if(fs.lstatSync(data.dir + '/'+ curfiles[i]).isDirectory() && curfiles[i] !== 'test'
					&& curfiles[i] !== 'tests' && curfiles[i] !== 'example' && curfiles[i] !== 'examples'){
				const newpath = path.resolve(data.dir, curfiles[i]);
				const newfiles = fs.readdirSync(newpath);
				var result = dirScan(newpath, newfiles);
			}
		}
	};
};

// if (process.argv.length !== 3){
// 	let err = 'Incorrect usage. Type:\nnode syntaxSearchTool.js <directory>';
// 	throw err;
// };
const srcDir = path.resolve(process.argv[2], '');
const content = dirScan(srcDir, fs.readdirSync(srcDir));

console.log("Finished scan.");

// var d = path.resolve('../bench_packages/test_dir', 'syntax.js');
// const ast = buildLinkedASTFromFile(d);
// console.log(ast.body[4].expression);
// console.log(ast.body[4].expression.callee);
// data = findVulns(ast, d);
// //execData = mySQLVulnerabilityFinder(ast, d);
// console.log(data);
