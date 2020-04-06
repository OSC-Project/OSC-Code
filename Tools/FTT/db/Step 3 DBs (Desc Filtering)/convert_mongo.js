const fs = require('fs');

//retrieve entries from JSON
var ref = JSON.parse(fs.readFileSync(process.argv[3] || "../Step 2 DBs (Sourceclear)/sourceclear_res_11-12-2019.json", "utf8")).entries;

let now = new Date();
let outputString = 'mongoprep_res_' + now.toLocaleDateString().replace(/\//g,"-") + ".json";

for (var vuln of ref) {
  fs.appendFile(outputString, JSON.stringify(vuln) + "\n", (err) => { if (err) throw err; });
}
