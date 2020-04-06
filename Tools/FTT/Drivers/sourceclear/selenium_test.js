//require webdriver
const webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const chromedriver = require('chromedriver');
chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());
//require filesystem
const fs = require('fs');

//retrieve entries from JSON
var ref = JSON.parse(fs.readFileSync(process.argv[2] || "../../db/Step 1 DBs (NVD)/nvd_res_10-8-2019.json", "utf8")).entries;

//filter entries for relevant CWEs

console.log("length of ref before: "+ ref.length);
/*
ref = ref.filter((vuln) => {
  return vuln.cwe == "CWE-200"
  || vuln.cwe == "CWE-94"
  || vuln.cwe == "CWE-95"
  || vuln.cwe == "CWE-89"
  || vuln.cwe == "CWE-77"
  || vuln.cwe == "CWE-78"
  || vuln.cwe == "CWE-502";
})
*/
console.log("length of ref after: "+ ref.length);


//create browser
var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build();

//scrape the second page of sourceclear
var scrapeSecondPage = async function (driver) {
  //create empty result object
  let result = {allVersions: [],
                vulnerableRange:[],
                safeRange:[],
                installString: "",
                packager: "",
                patchLink: ""};

  //Find all versions
  var allVersionsXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        \n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[2]/div[@class='col-1-1 pt pb+ mb-']/div[@class='grid grid--full ph']/div[@class='grid__item col-1-1']/div[@class='grid']/div[@class='grid__item col-1-4 phone--col-1-1']/div[@class='grid grid--full col-1-1']/div[@class='grid__item col-1-1 mt-']/form[@class='grid max-height--400']";
  var versions = driver.findElement({xpath: allVersionsXPath})//.getText()//.then((text) => {console.log(text.split(/"/)[3])});
  await versions.then(async function () {
    versions = await versions.getText();
    versions = versions.split(/\n/).reverse();
    result.allVersions = versions;
  }, function () {
    console.log("Could not find versions.");
    versions = undefined;
  })

  //Find all safe versions
  var safeVersionsXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        \n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[1]/div[@class='col-1-1 bo-b--1 border-color--muted-light pb+ mb-']/div[@class='grid grid--full ph']/div[@class='col-1-1']/div[@class='grid grid--narrower']/div[@class='grid__item col-1-1 pb-']/div[2]/div[@class='grid__item col-1-1 pt']/div[@class='grid']/div[@class='grid__item col-1-4 phone--col-1-1 ']/div[@class='grid grid--full col-1-1']/div[@class='grid__item col-1-1 mt-']/form[@class='grid max-height--400']";
  var safeVersions = driver.findElement({xpath: safeVersionsXPath});//.getText()//.then((text) => {console.log(text.split(/"/)[3]))});
  await safeVersions.then(async function () {
    safeVersions = await safeVersions.getText();
    safeVersions = safeVersions.split(/\n/).reverse();
    result.safeRange = safeVersions;
  }, function () {
    console.log("Could not find safe versions.");
    firstSafe = undefined;
  })

  //Populate vulnerable versions
  result.vulnerableRange = result.allVersions.filter((v) => !(result.safeRange.includes(v)));

  //Handle the install string and package manager
  var installStringXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        \n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[2]/div[@class='col-1-1 pt pb+ mb-']/div[@class='grid grid--full ph']/div[@class='grid__item col-1-1']/div[@class='grid']/div[@class='grid__item col-3-4 bo-l--1 border-color--muted phone--col-1-1 phone--bo-0 phone--pt']/div[@class='grid ph flex phone--grid--full']/div[@class='inline-block col-1-1 pl phone--pl0']/div[@class='grid pt-']/div[@class='grid__item col-1-1 pt'][2]/div[@class='grid']/div[@class='grid__item col-1-1 pt-- pl0']/div[@class='font-family--code bg-color--black-dark p- color--white phone--font--h7 phone--no-overflow']";
  var installString = driver.findElement({xpath: installStringXPath})//.getText()//.then((text) => {console.log(text)});
  await installString.then(async function () {
    installString = await installString.getText();
    result.installString = installString.split(/@/)[0] + '@';
    result.packager = result.installString.split(/ /)[0];
  }, function () {
    console.log("Could not find the install string/package manager.");
    installString = undefined;
  })

  //find patch link
  var patchLinkXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        \n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[1]/div[@class='col-1-1 bo-b--1 border-color--muted-light pb+ mb-']/div[@class='grid grid--full ph']/div[@class='col-1-1']/div[@class='grid grid--narrower']/div[@class='grid__item col-1-1 pb-']/div[2]/div[@class='grid']/div[@class='grid__item col-3-8 phone--pv']/div[@class='grid']/div[@class='grid__item text--center'][1]/div[@class='mt-- bo--1 pv-- ph- border-color--white-dark bg-color--white-medium']/a[@class='link--primary']";
  var patchLink = driver.findElement({xpath: patchLinkXPath});
  await patchLink.then(async function () {
    patchLink = await patchLink.getAttribute("href");
    result.patchLink = patchLink;
  }, function () {
    console.log("Could not find the patch link.");
    patchLink = undefined;
  })

  // return full result object
  return result;
}

var linkXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        no-responsive\n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[@class='grid grid--full'][2]/div[@class='grid__item col-1-1'][1]/div[@class='grid']/div[@class='grid__item col-1-1']/div[@class='grid__item ']/div/div[@class='grid pt--']/div[@class='grid__item col-1-1']/div[@class='grid']/div[@class='grid__item col-1-1']/div[@class='font--h6 mt--']/a[@class='link--no-underline']";
async function fetchVersion(cveID) {
  var versions;

  await driver.get('https://www.sourceclear.com/vulnerability-database/search#query=' + cveID);
  await driver.sleep(1000);
  var link = await driver.wait(until.elementLocated({xpath:linkXPath}), 4000).then(async () => {
    driver.findElement({xpath:linkXPath}).click();
    await driver.sleep(1000);
    versions = await scrapeSecondPage(driver);
  },
  async () => {
    console.log("Vulnerability not found on DB");
     driver = await new webdriver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options().headless())
        .build();

    versions = {allVersions: [],
                  vulnerableRange:[],
                  safeRange:[],
                  installString: "",
                  packager: "",
                  patchLink: ""}
  })



  /*
  var secondPageLoadedXPath = "/html/body/div[@id='app']/div[@class='\n        false\n        \n      ']/div[@class='flex flex--flex-direction--column height--100vh']/div[@class='container flex flex--content']/div[@class='col-5-6 pl phone--col-1-1 phone--p0']/div[2]/div/div[2]/div[@class='grid mt']/div[@class='grid__item col-3-4']/section[@class='grid']/div[@class='grid__item']/section/div[@class='mt']/div[2]/div[@class='pb']/div[@class='ph pt-']/div/div[2]/div[@class='col-1-1 pt pb+ mb-']/div[@class='grid grid--full ph']/div[@class='grid__item col-1-1']/div[@class='grid']/div[@class='grid__item col-1-4 phone--col-1-1']/div[@class='grid grid--full col-1-1']/div[@class='grid__item col-1-1 mt-']/form[@class='grid max-height--400']";
  await driver.wait(until.elementLocated({xpath:secondPageLoadedXPath}));
  */ // TODO: dynamic wait for second page to load
  //return versions;
  return versions;
}

var output = [];
async function main() {
  for (var i = 0; i < ref.length; i++) {
    console.log("(" + i+1 + "/" +ref.length + "): " + ref[i].cve);
    var res = await fetchVersion(ref[i].cve);
    if (res.allVersions[0]) {
      ref[i].versions = {allVersions: res.allVersions,
                         vulnerableRange: res.vulnerableRange,
                         safeRange: res.safeRange};
      ref[i].installString = res.installString;
      ref[i].packager = res.packager;
      ref[i].patchLink = res.patchLink;
      output.push(ref[i]);
    }
    //console.log(res);
  }
  let now = new Date();
  let outputString = 'sourceclear_res_' + now.toLocaleDateString().replace(/\//g,"-") + ".json";
  fs.writeFile(outputString, JSON.stringify({entries: output}), (err) => { if (err) throw err; });
}
main();
