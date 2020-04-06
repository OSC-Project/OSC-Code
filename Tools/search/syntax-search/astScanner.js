const acorn = require('acorn');							//ast parser / bulder
var fs = require('fs');
const methodFinder = require("./signatures.js").mf;
const injections = require("./signatures.js").inj;

class ASTScanner{
  constructor(types=""){
    this.types = [],
    this.path = "",
    this.tree = null,
    this.results = null;
    if (types == ""){
      for (var i = 0; i < injections.length; i++) {
        if(!this.types.includes(injections.type)) this.types.push(injections.type);
      }
    }else {
      this.types.push(types);
    }
  }

  addFilePath(path){
    this.path = path;
  }

  buildTree(){
    if(!this.path) {
      console.log("No path to a file has been given");
      return null;
    }
    let source = fs.readFileSync(this.path).toString('utf-8');
  	let ast = acorn.parse(source, {ecmaVersion: 6, locations: true, allowHashBang: true, allowImportExportEverywhere: true,}); //sourceType: 'module',});
    this.tree = ast;
  }

  packageData(rec, argz, tree = null, prev = null, typeSearch = null){
    console.log("Here");
  	return {
  		receiver 	: rec,
  		args			: argz,
  		scope 		: tree,
  		previous	: prev,
  		type 			: typeSearch
    }
  }

  filter(method, arr, mod_name){//filters the list to find if the method is called
  	res = [];
  	for (var k = 0; k < arr.length; k++) {
  		const found = methodFinder(arr[k].scope, arr[k].type, method, arr[k].receiver.name, null, arr[k].path);
  		for (var i = 0; i < found.length; i++) {
  			if (found.length === 0) {
  			}else if(found[i].receiver.type === 'Identifier'){
  				res.push(this.packageData(found[i].receiver, found[i].args, found[i].scope, arr[k], 'v', arr[k].path));
  			}else if (found[i].receiver.type === 'CallExpression') {
  				res.push(this.packageData(found[i].receiver.callee, found[i].args, found[i].scope, arr[k], 'm', arr[k].path));
  			}else if (found[i].receiver.type === 'MemberExpression') {
  				res.push(this.packageData({name: [found[i].receiver.object.name, found[i].receiver.property.name], loc: found[i].receiver.loc}, found[i].args, found[i].scope, arr[k], 'r', arr[k].path));
  			}else if (found[i].receiver.type === 'SequenceExpression') {
  				res.push(this.packageData(found[i].receiver, found[i].args, found[i].scope, arr[k], 'v', arr[k].path));
  			}
  		}
  	}
  	return res;
  }

  filterRequire(moduleName, arr){ //checks that the require is to the correct module
  	result = [];
  	for (var k = 0; k < arr.length; k++) {
  		const found = methodFinder(arr[k].scope, arr[k].type, 'require', arr[k].receiver.name, arr[k].path);
  		for (var i = 0; i < found.length; i++) {
  			if (found.length === 0) {
  			}else if(found[i].args[0].value === moduleName){
  				result.push(this.packageData(found[i].receiver, found[i].args, found[i].scope, arr[k]));
  			};
  		}
  	}
  	return result;
  }

  verifyArgs(e_list){//checks the args' types
  	let list = [];
  	for (var z = 0; z < e_list.length; z++) {
  		while (e_list[z].previous.previous !== null){
  			e_list[z] = e_list[z].previous;
  		}
  		list.push(e_list[z]);
  	}
  	let result = [];
  	for (var i = 0; i < list.length; i++) {
  			switch (list[i].args[0].type) {
  				case 'Literal': //do nothing
  					break;
  				case 'Identifier':
  					const found = methodFinder(list[i].scope, 'a', null, list[i].args[0].name);
  					if (found[0].type !== 'Literal') {
  						if(!result.includes(list[i])){
  							result.push(list[i]);
  						}
  					}
  					break;//Search for variable and check definition
  				case 'BinaryExpression':
  					if (list[i].args[0].left.type !== 'Literal' || list[i].args[0].right.type !== 'Literal') {
  						if(!result.includes(list[i])){
  							result.push(list[i]);
  						}
  					}
  					break;//Might be concatinating
  				case 'CallExpression':
  					result.push(list[i]);
  					break;
  				default:
  					result.push(list[i]);
  				break;
  			}
  	}
  	return result;
  }

  searchTree(type=""){
    if (!this.tree) this.buildTree();
    if (type === "") type = this.types;
    let calls = [];
    for (var j = 0; j < injections.length; j++){
  		if (type === "" || type === injections[j].type) {
  			let blank = [];
  			if (injections[j].type === 'js_extra'){
  				blank = [packageData({name: ''}, null, tree, null, 's')];
  			}else{
  				blank = [packageData({name: ''}, null, tree, null, 'm')];
  			}
  			for (var k = 0; k < injections[j].sinks.length; k++) {
  				calls.push(this.filter(injections[j].sinks[k], blank));
          }
        }
      }
      return calls;
  }

  completeScan(type="") {
    if (!this.tree) this.buildTree();
    console.log("A");
  	let result = [];
  	let calls = [];
  	let entries = [];
  	for (var j = 0; j < injections.length; j++){
      console.log("AAA");
  		if (type === "" || type === injections[j].type) {
  			let blank = [];
        console.log("NCS");
  			if (injections[j].type === 'js_extra'){
          console.log(1);
  				blank = [packageData({name: ''}, null, tree, null, 's')];
  			}else{
          console.log(2);
  				blank = [packageData({name: ''}, null, tree, null, 'm')];
  			}
        console.log("B");
  			for (var k = 0; k < injections[j].sinks.length; k++) {
  				calls = this.filter(injections[j].sinks[k], blank);
  				if (!injections[j].pattern){
  					entries = calls;
  				} else if (injections[j].pattern.length > 1){
  					entries = this.filterRequire(injections[j].pattern[1], this.filter(injections[j].pattern[0], calls));
  				}else{
  					entries = this.filterRequire(injections[j].pattern[0], calls);
  				}
  				var dangerousCalls = this.verifyArgs(entries);
          console.log("C");
  				for (var i = 0; i < dangerousCalls.length; i++) {
  					if (!result.includes(dangerousCalls[i].receiver.loc.start.line)) {
  						result.push(injections[j].type, dangerousCalls[i].receiver.loc.start.line);
  					}
  				}
  			}
  		}
  	}
  	this.results = result;
    console.log("results:");
    console.log(result);
    console.log("-------------------");
  }

  results(){
    return this.results;
  }

  tree(){
    if (!this.tree) this.buildTree();
    return this.tree;
  }

  injectionTypes(){
    return this.types;
  }
}

module.exports = ASTScanner;
