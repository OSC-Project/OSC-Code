//combines nvd entry logs
const fs = require('fs');
const path = require('path');

var file1 = fs.readFileSync(process.argv[2] || null, "utf8");
var file2 = fs.readFileSync(process.argv[3] || null, "utf8");

var data1 = JSON.parse(file1);
var data2 = JSON.parse(file2);
//console.log(data2.entries[0]);

for (var i = 0; i < data2.entries.length; i++) {
  //console.log(data2.entries[i]);
  //console.log(data1.entries.filter((entry) => entry.cve == data2.entries[i].cve).length <= 0);

  if (data1.entries.filter((entry) => entry.cve == data2.entries[i].cve).length <= 0) {
    data1.entries.push(data2.entries[i]);
    console.log("merged: " + data2.entries[i].cve);
  } else {
    console.log("duplicate: " + data2.entries[i].cve);
  }
}

fs.writeFile(process.argv[4] || 'combined_list.json', JSON.stringify(data1), (err) => { if (err) throw err; });
