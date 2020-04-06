const fs = require('fs');
const path = require('path');
const ASTScanner = require('./astScanner.js')


const dirScan = function(curpath, curfiles){
	var data = {
		dir   : curpath,
		files : []
	};

	for (var i = 0; i < curfiles.length; i++) {
		var file = {
			name  : null,
			vulns : []
		};
		if (path.extname(curfiles[i]) === '.js' && curfiles[i][0] !== '.' && !curfiles[i].includes('min')
				&& curfiles[i] !== 'test.js' && curfiles[i] !== 'example.js'){
			file.name = curfiles[i];
			// console.log("building tree for: "+file.name+" in: "+ data.dir);
			try {
				console.log("NEW");
				scanner = new ASTScanner();
				scanner.addFilePath(path.resolve(data.dir, file.name));
			  scanner.completeScan();
				found = scanner.results();
				if(found.length !== 0) {
					container = [];

					container.push({
						type : [found[0], 1],
						line : [found[1]]
					})
					if (found.length !== 2) {
						for (var k = 2; k < found.length; k += 2) {
							for (var m = 0; m < container.length; m++) {
								if (container[m].type[0] === found[k]){
									container[m].type[1] += 1;
									container[m].line.push(found[k+1])
								}else if(m == container.length - 1){
									container[m + 1] = {
										type : [found[k], 1],
										line : [found[k+1]]
									};
								}
							}
						};
					}
					file.vulns = container;
					data.files.push(file);
				};
			} catch (e) {
				report.results.push(data.dir + " In file: " + file.name+ '\nHas error: ' +e.name+ ' ' + e.message+ '\n\n')
				//stream.write(data.dir + " In file: " + file.name+ '\nHas error: ' +e.name+ ' ' + e.message+ '\n\n');
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
	if (data.files.length !== 0) response.results.push(data);
	return response;
};

const targetDir = path.resolve(process.argv[2], '');
var vFilter = '';
if (process.argv[3]) vFilter = process.argv[3];

if(vFilter === "--help" || vFilter === "--h"){
	console.log("\nUsage:\n\'node syntaxSearchTool_V2.js <target directory> <options> <filter>\'\n");
	console.log("<options>:");
	console.log("\t--help/--h:\tHow to run the tool.");
	console.log("\t--c/--clear:\tClears the log and review files.");
	console.log("This field may be left blank\n");
	console.log("<filter>:");
	console.log("\tAny of the following types: "+types);
	console.log("This field may be left blank\nOnly the clear option and true/a filter combination will scan\n");
}else if((vFilter === "--c" || vFilter === "--clear") && process.argv.length === 4){
	fs.closeSync(fs.openSync("log.json", 'w'));
	fs.closeSync(fs.openSync("review.json", 'w'));
}else if (process.argv.length === 5 && (!types.includes(process.argv[4]) ^ ['true','True'].includes(process.argv[4]))){
	console.log("Incorrect filter");
}else{
	console.log("Starting Scan...\n");
	var stream, contents;
	if (vFilter === "--c" || vFilter === "--clear" && process.argv.length === 5) {
		fs.closeSync(fs.openSync("log.json", 'w'));
		fs.closeSync(fs.openSync("review.json", 'w'));
		fs.closeSync(fs.openSync("summary.txt", 'w'));
		vFilter = process.argv[4];
	}
	try {
		if (fs.existsSync("log.json")) {
			contents = fs.readFileSync("log.json", "utf8");
			if (contents == '') contents = "[]";
		}else {
			fs.openSync("log.json", "a");
			contents = "[]";
		}
		if (fs.existsSync("review.json")) {
			stream = fs.readFileSync("review.json", "utf8");
			if (stream == '') stream = "[]";
		}else {
			fs.openSync("review.json", "a");
			stream = "[]";
		}
		if (fs.existsSync("summary.txt")) {
			stream = fs.readFileSync("summary.txt", "utf8");
			if (stream == '') stream = "[]";
		}else {
			fs.openSync("review.json", "a");
			stream = "[]";
		}
	}catch(e) {
		console.log(e);
		console.error("Could not create logging files!");
		contents = "[]";
		stream = "[]";
	}

	var prevResults, prevReport;
	try {
		prevResults = JSON.parse(contents);
	}catch(e) {
		console.log(e);
		console.error("Could not parse prevResults!");
		prevResults = [];
	}
 try {
	prevReport = JSON.parse(stream);
 } catch (e) {
	 console.log(e);
	 console.error("Could not parse prevReport!");
	prevReport = [];
 }
	var response = {
		runStarted: Date().toString(),
		results : []
	};

	var report = {
		runStarted: Date().toString(),
		results : []
	}

	const content = dirScan(targetDir, fs.readdirSync(targetDir));
	prevResults.push(content);
	prevReport.push(report);

	fs.writeFileSync('log.json', JSON.stringify(prevResults, null, '    '), 'utf8', function (err) {
	   if (err) return console.log(err);
	 });
	fs.writeFileSync('review.json', JSON.stringify(prevReport, null, '    '), 'utf8', function (err) {
	  if (err) return console.log(err);
	});

	console.log("Finished scan.\n");
}
/*  DEBUGGING SECTION  */

// var d = path.resolve('../bench', 'exploitable.js');
// const ast = buildLinkedASTFromFile(d);
// console.log(ast.body[3].declarations[0]);
// // console.log(ast.body[4].expression.callee);
// // data = vulnerabilityFinder(ast, d);
// // // //execData = mySQLVulnerabilityFinder(ast, d);
// // console.log(data);
