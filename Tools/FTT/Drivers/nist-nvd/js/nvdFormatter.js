//This script takes two arguments <input file> <output file>.
//It converts kerwins output json from his "NIST_extractor.py"
//into chris' format.
const fs = require('fs');
const path = require('path');

var jsonData = fs.readFileSync(process.argv[2] || "./NIST_res.json", "utf8");
var data = JSON.parse(jsonData);

var filterList = data.CVE_Items.filter((vuln) => {
  var yes = "";
  if (vuln.configurations.nodes[0]) {
    if (vuln.configurations.nodes[0].cpe_match) {
      yes = vuln.configurations.nodes[0].cpe_match[0].cpe23Uri;
    } else {
      yes = vuln.configurations.nodes[0].children[0].cpe_match[0].cpe23Uri;
    }
  }
  return yes.includes(".js");
})
console.log(filterList.length);

var output = [];

for (vuln of filterList) {
  var entry = {};
  vuln = vuln.cve;
  entry.cve = vuln.CVE_data_meta.ID;

  entry.cwe = vuln.problemtype.problemtype_data[0].description[0].value;

  entry.summary = vuln.description.description_data[0].value;

  entry.references = [];
  for (ref of vuln.references.reference_data) {
    entry.references.push(ref.url);
  }

  entry.versions = {};
  /*
  entry.versions.vulnerable = [];
  for (spec of vuln.vulnerable_config) {
    entry.versions.vulnerable.push({version: "", cpe23: spec.cpe23Uri});
  }

  entry.versions.safe = [];
  for (spec of vuln.non_vulernable_config) {
    entry.versions.safe.push({version: "", cpe23: spec.cpe23Uri});
  }
  */
  output.push(entry);

}


fs.writeFile(process.argv[3] || process.argv[2]+"_formatted.json", JSON.stringify({entries: output}), (err) => { if (err) throw err; });
