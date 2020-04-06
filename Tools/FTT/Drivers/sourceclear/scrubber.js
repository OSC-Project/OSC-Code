const exec = require('child_process').exec;
const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

var ref = JSON.parse(fs.readFileSync('./combined_list.json', "utf8")).entries;

/*
for (entry of ref) {
  exec('curl https://www.sourceclear.com/vulnerability-database/search#query=' + entry.cve, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    //console.log(`stdout: ${stdout}`);
    const dom = new JSDOM(stdout);
    //console.log(dom.window.document.getElementsByClassName("max--col-7-10 text--overflow pl0 font--h6").textContent);

  });
}
*/

/*
console.log(ref[0].cve);
exec('curl https://www.sourceclear.com/vulnerability-database/search#query=' + ref[0].cve, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  const dom = new JSDOM(stdout, { runScripts: "dangerously" });
  console.log(dom.window.document);
  fs.writeFile('document.json', JSON.stringify(dom.window.document), (err) => { if (err) throw err; });
  //console.log(dom.window.document.getElementsByClassName("max--col-7-10 text--overflow pl0 font--h6").textContent);

});
*/

JSDOM.fromURL('https://www.sourceclear.com/vulnerability-database/search#query=' + ref[0].cve,{runScripts: "dangerously",resources: "usable"}).then(dom => {
  console.log(dom.serialize());
});
