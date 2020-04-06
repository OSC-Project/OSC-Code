const fs = require('fs');

//retrieve entries from JSON
var ref = JSON.parse(fs.readFileSync(process.argv[3] || "../Step 2 DBs (Sourceclear)/sourceclear_res_11-12-2019.json", "utf8")).entries;

//find cwe frequencies of db, write to json
function cweFreqs(db) {
  var freqs = {}
  for (vuln of db) {
    if(freqs[vuln.cwe]){
      freqs[vuln.cwe]++;
    } else{
      freqs[vuln.cwe] = 1;
    }
  }
  console.log(freqs);
  return freqs;
}

//filter db for entries containing substring in summary
function dbFilter(db, filterString) {
  console.log("Length before filter:", db.length);
  var filteredDb = db.filter((vuln) => {
    return vuln.summary.includes(filterString)
    || vuln.cwe == "CWE-94"
    || vuln.cwe == "CWE-95"
    || vuln.cwe == "CWE-89"
    || vuln.cwe == "CWE-77"
    || vuln.cwe == "CWE-78"
    || vuln.cwe == "CWE-502"
  })
  console.log("Length after filter:", filteredDb.length);
  return filteredDb;
}

//var freqs = cweFreqs(dbFilter(ref , process.argv[2]));
var result = dbFilter(ref , process.argv[2]);

let now = new Date();
let outputString = 'descfilter_res_' + now.toLocaleDateString().replace(/\//g,"-") + ".json";
fs.writeFile(outputString, JSON.stringify({entries: result}), (err) => { if (err) throw err; });
